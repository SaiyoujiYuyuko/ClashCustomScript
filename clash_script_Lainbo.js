function main(content) {
  const isObject = (value) => {
    return value !== null && typeof value === 'object'
  }

  const mergeConfig = (existingConfig, newConfig) => {
    if (!isObject(existingConfig)) {
      existingConfig = {}
    }
    if (!isObject(newConfig)) {
      return existingConfig
    }
    return { ...existingConfig, ...newConfig }
  }

  const cnDnsList = [
    'https://223.5.5.5/dns-query',
    'https://223.6.6.6/dns-query',
  ]
  const trustDnsList = [
    'quic://dns.cooluc.com',
    'https://doh.apad.pro/dns-query',
    'https://1.0.0.1/dns-query',
  ]
  const notionDns = 'tls://dns.jerryw.cn'
  const notionUrls = [
    'http-inputs-notion.splunkcloud.com',
    '+.notion-static.com',
    '+.notion.com',
    '+.notion.new',
    '+.notion.site',
    '+.notion.so',
  ]
  const combinedUrls = notionUrls.join(',');
  const dnsOptions = {
    'enable': true,
    'prefer-h3': true, // 如果DNS服务器支持DoH3会优先使用h3
    'default-nameserver': cnDnsList, // 用于解析其他DNS服务器、和节点的域名, 必须为IP, 可为加密DNS。注意这个只用来解析节点和其他的dns，其他网络请求不归他管
    'nameserver': trustDnsList, // 其他网络请求都归他管
    
    // 这个用于覆盖上面的 nameserver
    'nameserver-policy': {
      [combinedUrls]: notionDns,
      'geosite:geolocation-!cn': trustDnsList,
      '+.gdsky.com.cn': '10.44.47.59'
      // 如果你有一些内网使用的DNS，应该定义在这里，多个域名用英文逗号分割
      // '+.公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1'
    },
  }

  // GitHub加速前缀
  const githubPrefix = 'https://fastgh.lainbo.com/'

  // GEO数据GitHub资源原始下载地址
  const rawGeoxURLs = {
    geoip: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat',
    geosite: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
    mmdb: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb',
  }

  // 生成带有加速前缀的GEO数据资源对象
  const accelURLs = Object.fromEntries(
    Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [key, `${githubPrefix}${githubUrl}`]),
  )

  const otherOptions = {
    'unified-delay': true,
    'tcp-concurrent': true,
    'profile': {
      'store-selected': true,
      'store-fake-ip': true,
    },
    'sniffer': {
      enable: true,
      sniff: {
        TLS: {
          ports: [443, 8443],
        },
        HTTP: {
          'ports': [80, '8080-8880'],
          'override-destination': true,
        },
      },
    },
    'geodata-mode': true,
    'geox-url': accelURLs,
  }
  content.dns = mergeConfig(content.dns, dnsOptions)
  
  ////
  // 创建代理组的函数
  function createProxyGroup(name, type, icon, proxies) {
    return {
      name,
      type,
      url: "http://www.gstatic.com/generate_204",
      icon,
      interval: 300,
      tolerance: type === "url-test" ? 20 : undefined,
      timeout: type === "url-test" ? 2000 : undefined,
      lazy: true,
      proxies: proxies.length > 0 ? proxies : ["DIRECT"],
      strategy: type === "load-balance" ? "consistent-hashing" : undefined
    };
  }

  // 通过正则表达式获取代理的函数
  function getProxiesByRegex(content, regex) {
    return content.proxies
      .filter(e => regex.test(e.name))
      .map(e => e.name);
  }

  // 定义区域及其正则表达式
  const regions = [
    { name: "HongKong", regex: /香港|HK|Hong|🇭🇰/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png" },
    { name: "TaiWan", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png" },
    { name: "Singapore", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png" },
    { name: "Japan", regex: /日本|Tokyo|JP|Japan|🇯🇵/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png" },
    { name: "America", regex: /美国|US|United States|America|🇺🇸/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png" },
    { name: "Others", regex: /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png" },
    { name: "Auto", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png", type: "url-test" },
    { name: "Balance", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png", type: "load-balance" },
    { name: "Fallback", regex: /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png", type: "fallback" }
  ];

  // 创建代理组
  const proxyGroups = regions.map(region =>
    createProxyGroup(region.name, region.type || "url-test", region.icon, getProxiesByRegex(content, region.regex))
  );

  // 预定义代理组
  const predefinedGroups = [
    { name: "Final", type: "select", proxies: ["DIRECT", "Global", "Proxy"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png" },
    { name: "Proxy", type: "select", proxies: [...new Set(proxyGroups.flatMap(g => g.proxies))], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png" },
    { name: "Global", type: "select", proxies: ["DIRECT","Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" },
    { name: "Mainland", type: "select", proxies: ["DIRECT", "Global", "Proxy", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Round_Robin.png" },
    { name: "ArtIntel", type: "select", proxies: ["Proxy", "Global", "America", "Japan", "Singapore", "TaiWan", "HongKong", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Copilot.png" },
    { name: "YouTube", type: "select", proxies: ["Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" },
    { name: "BiliBili", type: "select", proxies: ["DIRECT", "HongKong", "TaiWan"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/bilibili.png" },
    { name: "Streaming", type: "select", proxies: ["Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ForeignMedia.png" },
    { name: "Telegram", type: "select", proxies: ["Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" },
    { name: "Apple", type: "select", proxies: ["DIRECT","Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png" },    
    { name: "Google", type: "select", proxies: ["Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" },
    { name: "Games", type: "select", proxies: ["DIRECT","Proxy", "Global", "Auto", "Balance", "Fallback", "HongKong", "TaiWan", "Singapore", "Japan", "America", "Others"], icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" }
  ];

  // 插入分组
  content["proxy-groups"] = [...predefinedGroups, ...proxyGroups];

  // 插入规则
  content.rules = [
    "AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOIP,CN,no-resolve))),REJECT",// quic
    // "GEOSITE,Category-ads-all,REJECT",// 可能导致某些网站无法访问
    "GEOSITE,Private,DIRECT",
    "GEOSITE,Bing,ArtIntel",
    "GEOSITE,Openai,ArtIntel",
    "GEOSITE,Category-games@cn,Mainland",
    "GEOSITE,Category-games,Games",
    "GEOSITE,Github,Global",
    "GEOIP,Telegram,Telegram,no-resolve",
    "GEOSITE,Bilibili,BiliBili",
    "GEOSITE,Youtube,YouTube",
    "GEOSITE,Disney,Streaming",
    "GEOSITE,Netflix,Streaming",
    "GEOSITE,HBO,Streaming",
    "GEOSITE,Primevideo,Streaming",
    "GEOSITE,Google,Google",
    "GEOSITE,Microsoft@cn,Mainland",
    "GEOSITE,Apple@cn,Mainland",
    "GEOSITE,Geolocation-!cn,Global",
    "GEOSITE,CN,Mainland",
//    "RULE-SET,telegram_domain,Telegram",
//    "RULE-SET,telegram_ip,Telegram,no-resolve",
    "RULE-SET,google,Global",
    "RULE-SET,proxy,Global",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT,no-resolve",
    "RULE-SET,cncidr,DIRECT,no-resolve",
    //Custom
    'DOMAIN-SUFFIX,rjno1.com,DIRECT',
    'DOMAIN,ldqk.xyz,DIRECT',
    'DOMAIN-SUFFIX,v6.army,DIRECT',
    'DOMAIN-SUFFIX,ashuiai.com,DIRECT',
    'DOMAIN-SUFFIX,jsdelivr.net,DIRECT',
    'DOMAIN-SUFFIX,okggback.top,DIRECT',
    'DOMAIN-SUFFIX,cnki.net,DIRECT ',
    'DOMAIN-SUFFIX,huggingface.co,Global',
    'RULE-SET,Advertising,REJECT',
    'RULE-SET,Advertising_Domain,REJECT',
    'RULE-SET,BanAD,REJECT',
    'RULE-SET,Hijacking,REJECT',
    'RULE-SET,Privacy,REJECT',
    'RULE-SET,Privacy_Domain,REJECT',
    'RULE-SET,AdguardDNS,REJECT',
    
//    'RULE-SET,Special,DIRECT',
    'RULE-SET,Netflix,Streaming',
    'RULE-SET,Spotify,Streaming',
    'RULE-SET,YouTube,YouTube',
    'RULE-SET,Disney Plus,Streaming',
    'RULE-SET,Bilibili,Mainland',
    'RULE-SET,IQ,Mainland',
    'RULE-SET,IQIYI,Mainland',
    'RULE-SET,Letv,Mainland',
    'RULE-SET,Netease Music,Mainland',
    'RULE-SET,Tencent Video,Mainland',
    'RULE-SET,Youku,Mainland',
    'RULE-SET,WeTV,Mainland',
    'RULE-SET,ABC,Streaming',
    'RULE-SET,Abema TV,Streaming',
    'RULE-SET,Amazon,Streaming',
    'RULE-SET,Apple Music,Streaming',
    'RULE-SET,Apple News,Streaming',
    'RULE-SET,Apple TV,Streaming',
    'RULE-SET,Bahamut,Streaming',
    'RULE-SET,BBC iPlayer,Streaming',
    'RULE-SET,DAZN,Streaming',
    'RULE-SET,Discovery Plus,Streaming',
    'RULE-SET,encoreTVB,Streaming',
    'RULE-SET,Fox Now,Streaming',
    'RULE-SET,Fox+,Streaming',
    'RULE-SET,HBO Go,Streaming',
    'RULE-SET,HBO Max,Streaming',
    'RULE-SET,Hulu Japan,Streaming',
    'RULE-SET,Hulu,Streaming',
    'RULE-SET,Japonx,Streaming',
    'RULE-SET,JOOX,Streaming',
    'RULE-SET,KKBOX,Streaming',
    'RULE-SET,KKTV,Streaming',
    'RULE-SET,Line TV,Streaming',
    'RULE-SET,myTV SUPER,Streaming',
    'RULE-SET,Niconico,Streaming',
    'RULE-SET,Pandora,Streaming',
    'RULE-SET,PBS,Streaming',
    'RULE-SET,Pornhub,Streaming',
    'RULE-SET,Soundcloud,Streaming',
    'RULE-SET,ViuTV,Streaming',
    'RULE-SET,Telegram,Telegram',
    'RULE-SET,Discord,Global',
    'RULE-SET,SteamCN,DIRECT,no-resolve',
    
//    'RULE-SET,Steam,Games',
    'RULE-SET,Speedtest,DIRECT',
    'RULE-SET,PayPal,Global',
    'RULE-SET,Microsoft,DIRECT',
    'RULE-SET,Apple,DIRECT',
    'RULE-SET,Google FCM,Global',
    'RULE-SET,Scholar,Global',
    'RULE-SET,PROXY01,Global',
    'RULE-SET,PROXY02,Global',
    'RULE-SET,Domestic,Mainland',
    'RULE-SET,Domestic IPs,Mainland',
    'RULE-SET,LAN,DIRECT',
    
        // 规则集合开始
    'RULE-SET,applications,DIRECT',
    'DOMAIN,clash.razord.top,DIRECT',
    'DOMAIN,yacd.haishan.me,DIRECT',

    'RULE-SET,icloud,DIRECT',
    'RULE-SET,apple,Apple',
    'RULE-SET,private,DIRECT',
    'RULE-SET,reject,REJECT',
    'RULE-SET,tld-not-cn,Global',
    'RULE-SET,gfw,Global',
    'RULE-SET,telegramcidr,Telegram',
    'GEOIP,LAN,DIRECT',
    'GEOIP,CN,DIRECT',
    "MATCH,Final"
  ];

  /***
   *** 使用远程规则资源示例
   *** 使用时须在rules中添加对应规则
   *** E.G
   */



  // 远程规则类型
  const ruleAnchor = {
    ip: { type: 'http', interval: 86400, behavior: 'ipcidr', format: 'text' },
    classical: { type: 'http', interval: 86400, behavior: 'classical', format: 'text' },
    domain: { type: 'http', interval: 86400, behavior: 'domain', format: 'text' }
  };
  // 远程规则资源
  const ruleProviders = {
      reject: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
        path: './ruleset/reject.yaml',
        interval: 86400,
      },
      icloud: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt',
        path: './ruleset/icloud.yaml',
        interval: 86400,
      },
      apple: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt',
        path: './ruleset/apple.yaml',
        interval: 86400,
      },
      google: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
        path: './ruleset/google.yaml',
        interval: 86400,
      },
      proxy: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
        path: './ruleset/proxy.yaml',
        interval: 86400,
      },
      direct: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
        path: './ruleset/direct.yaml',
        interval: 86400,
      },
      private: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
        path: './ruleset/private.yaml',
        interval: 86400,
      },
      gfw: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
        path: './ruleset/gfw.yaml',
        interval: 86400,
      },
      greatfire: {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt',
        path: './ruleset/greatfire.yaml',
        interval: 86400,
      },
      'tld-not-cn': {
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
        path: './ruleset/tld-not-cn.yaml',
        interval: 86400,
      },
      telegramcidr: {
        type: 'http',
        behavior: 'ipcidr',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
        path: './ruleset/telegramcidr.yaml',
        interval: 86400,
      },
      cncidr: {
        type: 'http',
        behavior: 'ipcidr',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
        path: './ruleset/cncidr.yaml',
        interval: 86400,
      },
      lancidr: {
        type: 'http',
        behavior: 'ipcidr',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
        path: './ruleset/lancidr.yaml',
        interval: 86400,
      },
      applications: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt',
        path: './ruleset/applications.yaml',
        interval: 86400,
      },
      //Custom
  Advertising: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Advertising/Advertising.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },
  Advertising_Domain:{
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Advertising/Advertising_Domain.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },
  BanAD: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list',
    path: './Rules/Reject',
        interval: 86400,
      },  
  Hijacking: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Hijacking/Hijacking.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },
  Privacy: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Privacy/Privacy.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },
  Privacy_Domain:{
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Privacy/Privacy_Domain.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },
  AdguardDNS: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AdGuardSDNSFilter/AdGuardSDNSFilter_Classical.yaml',
    path: './Rules/Reject',
        interval: 86400,
      },    
  Special: {
        type: 'http',
        behavior: 'classical',
        url: 'https://fastly.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Special.yaml',
    path: './Rules/Special',
        interval: 86400,
      },
  Netflix: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Netflix/Netflix.yaml',
    path: './Rules/Media/Netflix',
        interval: 86400,
      },
  Spotify: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Spotify/Spotify.yaml',
    path: './Rules/Media/Spotify',
        interval: 86400,
      },
  YouTube: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTube/YouTube.yaml',
    path: './Rules/Media/YouTube',
        interval: 86400,
      },
  Bilibili: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/BiliBili/BiliBili.yaml',
    path: './Rules/Media/Bilibili',
        interval: 86400,
      },
  IQ: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/iQIYIIntl/iQIYIIntl.yaml',
    path: './Rules/Media/IQI',
        interval: 86400,
      },
  IQIYI: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/iQIYI/iQIYI.yaml',
    path: './Rules/Media/IQYI',
        interval: 86400,
      },
  Letv: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/LeTV/LeTV.yaml',
    path: './Rules/Media/Letv',
        interval: 86400,
      },
  Netease Music: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/NetEaseMusic/NetEaseMusic.yaml',
    path: './Rules/Media/Netease_Music',
        interval: 86400,
      },
  Tencent Video: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/TencentVideo/TencentVideo.yaml',
    path: './Rules/Media/Tencent_Video',
        interval: 86400,
      },
  Youku: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Youku/Youku.yaml',
    path: './Rules/Media/Youku',
        interval: 86400,
      },
  WeTV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/WeTV/WeTV.yaml',
    path: './Rules/Media/WeTV',
        interval: 86400,
      },
  ABC: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ABC/ABC.yaml',
    path: './Rules/Media/ABC',
        interval: 86400,
      },
  Abema TV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AbemaTV/AbemaTV.yaml',
    path: './Rules/Media/Abema_TV',
        interval: 86400,
      },
  Amazon: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Amazon/Amazon.yaml',
    path: './Rules/Media/Amazon',
        interval: 86400,
      },
  Apple Music: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AppleMusic/AppleMusic.yaml',
    path: './Rules/Media/Apple_Music',
        interval: 86400,
      },
  Apple News: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AppleNews/AppleNews.yaml',
    path: './Rules/Media/Apple_News',
        interval: 86400,
      },
  Apple TV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/AppleTV/AppleTV.yaml',
    path: './Rules/Media/Apple_TV',
        interval: 86400,
      },
  Bahamut: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Bahamut/Bahamut.yaml',
    path: './Rules/Media/Bahamut',
        interval: 86400,
      },
  BBC iPlayer: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/BBC/BBC.yaml',
    path: './Rules/Media/BBC_iPlayer',
        interval: 86400,
      },
  DAZN: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/DAZN/DAZN.yaml',
    path: './Rules/Media/DAZN',
        interval: 86400,
      },
  Discovery Plus: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/DiscoveryPlus/DiscoveryPlus.yaml',
    path: './Rules/Media/Discovery_Plus',
        interval: 86400,
      },
  Disney Plus: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Disney/Disney.yaml',
    path: './Rules/Media/Disney_Plus',
        interval: 86400,
      },
  encoreTVB: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/EncoreTVB/EncoreTVB.yaml',
    path: './Rules/Media/encoreTVB',
        interval: 86400,
      },
  Fox Now: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/FOXNOW/FOXNOW.yaml',
    path: './Rules/Media/Fox_Now',
        interval: 86400,
      },
  Fox+: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/FOXPlus/FOXPlus.yaml',
    path: './Rules/Media/Fox+',
        interval: 86400,
      },
  HBO Go: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/HBOUSA/HBOUSA.yaml',
    path: './Rules/Media/HBO_Go',
        interval: 86400,
      },
  HBO Max: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/HBOAsia/HBOAsia.yaml',
    path: './Rules/Media/HBO_Max',
        interval: 86400,
      },
  Hulu Japan: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/HuluJP/HuluJP.yaml',
    path: './Rules/Media/Hulu_Japan',
        interval: 86400,
      },
  Hulu: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Hulu/Hulu.yaml',
    path: './Rules/Media/Hulu',
        interval: 86400,
      },
  Japonx: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Japonx/Japonx.yaml',
    path: './Rules/Media/Japonx',
        interval: 86400,
      },
  JOOX: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/JOOX/JOOX.yaml',
    path: './Rules/Media/JOOX',
        interval: 86400,
      },
  KKBOX: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/KKBOX/KKBOX.yaml',
    path: './Rules/Media/KKBOX',
        interval: 86400,
      },
  KKTV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/KKTV/KKTV.yaml',
    path: './Rules/Media/KKTV',
        interval: 86400,
      },
  Line TV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/LineTV/LineTV.yaml',
    path: './Rules/Media/Line_TV',
        interval: 86400,
      },
  myTV SUPER: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/myTVSUPER/myTVSUPER.yaml',
    path: './Rules/Media/myTV_SUPER',
        interval: 86400,
      },
  Niconico: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Niconico/Niconico.yaml',
    path: './Rules/Media/Niconico',
        interval: 86400,
      },
  Pandora: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Pandora/Pandora.yaml',
    path: './Rules/Media/Pandora',
        interval: 86400,
      },
  PBS: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/PBS/PBS.yaml',
    path: './Rules/Media/PBS',
        interval: 86400,
      },
  Pornhub: {
        type: 'http',
        behavior: 'classical',
        url: 'https://fastly.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Pornhub.yaml',
    path: './Rules/Media/Pornhub',
        interval: 86400,
      },
  Soundcloud: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/SoundCloud/SoundCloud.yaml',
    path: './Rules/Media/Soundcloud',
        interval: 86400,
      },
  ViuTV: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ViuTV/ViuTV.yaml',
    path: './Rules/Media/ViuTV',
        interval: 86400,
      },
  Telegram: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Telegram/Telegram.yaml',
    path: './Rules/Telegram',
        interval: 86400,
      },
  Discord: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Discord/Discord.yaml',
    path: './Rules/Discord',
        interval: 86400,
      },
  Steam: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Steam/Steam.yaml',
    path: './Rules/Steam',
        interval: 86400,
      },
  SteamCN: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/SteamCN/SteamCN_No_Resolve.yaml',
    path: './Rules/SteamCN',
        interval: 86400,
      },  
  Speedtest: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Speedtest/Speedtest.yaml',
    path: './Rules/Speedtest',
        interval: 86400,
      },
  PayPal: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/PayPal/PayPal.yaml',
    path: './Rules/PayPal',
        interval: 86400,
      },
  Microsoft: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft.yaml',
    path: './Rules/Microsoft',
        interval: 86400,
      },
  PROXY01: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Proxy/Proxy.yaml',
    path: './Rules/Proxy',
        interval: 86400,
      },
  PROXY02:{
        type: 'http',
        behavior: 'domain',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Proxy/Proxy_Domain.yaml',
    path: './Rules/Proxy',
        interval: 86400,
      },
  Domestic: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMax/ChinaMax_Classical.yaml',
    path: './Rules/Domestic',
        interval: 86400,
      },
  Apple: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Apple/Apple.yaml',
    path: './Rules/Apple',
        interval: 86400,
      },
  Google FCM: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/GoogleFCM/GoogleFCM.yaml',
    path: './Rules/Google FCM',
        interval: 86400,
      },
  Scholar: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Scholar/Scholar.yaml',
    path: './Rules/Scholar',
        interval: 86400,
      },
  Domestic IPs:
    type: http
    behavior: ipcidr
    url: https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMax/ChinaMax_IP.yaml',
    path: './Rules/Domestic_IPs',
        interval: 86400,
      },
  LAN: {
        type: 'http',
        behavior: 'classical',
        url: 'https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Lan/Lan.yaml',
    path: './Rules/LAN',
        interval: 86400,
      },    
  };
  // 插入远程规则
  content["rule-providers"] = ruleProviders;
  
  
  return { ...content, ...otherOptions }
}