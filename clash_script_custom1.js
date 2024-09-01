// Define the `main` function

const proxyName = "代理模式";

function main(params) {
    if (!params.proxies) return params;
    overwriteRules(params);
    overwriteProxyGroups(params);
    overwriteDns(params);
    return params;
}
//覆写规则
function overwriteRules(params) {
    const rules = [
        "RULE-SET,reject,⛔广告拦截",
        "RULE-SET,direct,DIRECT",
        "RULE-SET,cncidr,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,lancidr,DIRECT",
        "GEOIP,LAN,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",
        "RULE-SET,applications,DIRECT",
        "RULE-SET,tld-not-cn," + proxyName,
        "RULE-SET,google," + proxyName,
        "RULE-SET,icloud," + proxyName,
        "RULE-SET,apple," + proxyName,
        "RULE-SET,gfw," + proxyName,
        "RULE-SET,greatfire," + proxyName,
        "RULE-SET,telegramcidr," + proxyName,
        "RULE-SET,proxy," + proxyName,
        "IP-CIDR,137.175.53.252/32,DIRECT,no-resolve",
        "IP-CIDR,137.175.53.250/32,DIRECT,no-resolve",
        "IP-CIDR,137.175.53.251/32,DIRECT,no-resolve",
        "IP-CIDR,137.175.53.222/32,DIRECT,no-resolve",
        "IP-CIDR,120.232.217.70/32,DIRECT,no-resolve",
        "IP-CIDR,183.236.49.239/32,DIRECT,no-resolve",
        "DOMAIN,x.yun.cat,DIRECT",
        "RULE-SET, Reject01, ⛔广告拦截",
        "RULE-SET, Special, DIRECT",
        "RULE-SET, Netflix, Netflix",
        "RULE-SET, Disney Plus, Disney",
        "RULE-SET, YouTube Music, YouTube",
        "RULE-SET, YouTube, YouTube",
        "RULE-SET, Spotify, Spotify",
        "RULE-SET, Bilibili, Asian TV",
        "RULE-SET, IQ, Asian TV",
        "RULE-SET, IQIYI, Asian TV",
        "RULE-SET, Letv, Asian TV",
        "RULE-SET, Netease Music, Asian TV",
        "RULE-SET, Tencent Video, Asian TV",
        "RULE-SET, Youku, Asian TV",
        "RULE-SET, WeTV, Asian TV",
        "RULE-SET, ABC, Global TV",
        "RULE-SET, Abema TV, Global TV",
        "RULE-SET, Amazon, Global TV",
        "RULE-SET, Bahamut, Global TV",
        "RULE-SET, BBC iPlayer, Global TV",
        "RULE-SET, DAZN, Global TV",
        "RULE-SET, Discovery Plus, Global TV",
        "RULE-SET, encoreTVB, Global TV",
        "RULE-SET, F1 TV, Global TV",
        "RULE-SET, Fox Now, Global TV",
        "RULE-SET, Fox+, Global TV",
        "RULE-SET, HBO Go, Global TV",
        "RULE-SET, HBO Max, Global TV",
        "RULE-SET, Hulu Japan, Global TV",
        "RULE-SET, Hulu, Global TV",
        "RULE-SET, Japonx, Global TV",
        "RULE-SET, JOOX, Global TV",
        "RULE-SET, KKBOX, Global TV",
        "RULE-SET, KKTV, Global TV",
        "RULE-SET, Line TV, Global TV",
        "RULE-SET, myTV SUPER, Global TV",
        "RULE-SET, Niconico, Global TV",
        "RULE-SET, Pandora, Global TV",
        "RULE-SET, PBS, Global TV",
        "RULE-SET, Pornhub, Global TV",
        "RULE-SET, Soundcloud, Global TV",
        "RULE-SET, ViuTV, Global TV",
        "RULE-SET, Apple Music, Apple TV",
        "RULE-SET, Apple News, Apple TV",
        "RULE-SET, Apple TV, Apple TV",
        "RULE-SET, Apple01, Apple",
        "RULE-SET, Telegram, Telegram",
        "RULE-SET, Crypto, Crypto",
        "RULE-SET, Discord, Discord",
        "RULE-SET, Google FCM, Google FCM",
        "RULE-SET, Microsoft, Microsoft",
        "RULE-SET, OpenAI, OpenAI",
        "RULE-SET, PayPal, PayPal",
        "RULE-SET, Scholar, Scholar",
        "RULE-SET, Speedtest, Speedtest",
        "RULE-SET, Steam, Steam",
        "RULE-SET, miHoYo, miHoYo",
        "RULE-SET, PROXY01," + proxyName,
        "RULE-SET, Domestic, DIRECT",
        "RULE-SET, Domestic IPs, DIRECT",
        "MATCH,🐟漏网之鱼",
    ];
    const ruleProviders = {
        reject: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
            path: "./ruleset/reject.yaml",
            interval: 86400,
        },
        icloud: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
            path: "./ruleset/icloud.yaml",
            interval: 86400,
        },
        apple: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
            path: "./ruleset/apple.yaml",
            interval: 86400,
        },
        google: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
            path: "./ruleset/google.yaml",
            interval: 86400,
        },
        proxy: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
            path: "./ruleset/proxy.yaml",
            interval: 86400,
        },
        direct: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
            path: "./ruleset/direct.yaml",
            interval: 86400,
        },
        private: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
            path: "./ruleset/private.yaml",
            interval: 86400,
        },
        gfw: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
            path: "./ruleset/gfw.yaml",
            interval: 86400,
        },
        greatfire: {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
            path: "./ruleset/greatfire.yaml",
            interval: 86400,
        },
        "tld-not-cn": {
            type: "http",
            behavior: "domain",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
            path: "./ruleset/tld-not-cn.yaml",
            interval: 86400,
        },
        telegramcidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
            path: "./ruleset/telegramcidr.yaml",
            interval: 86400,
        },
        cncidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
            path: "./ruleset/cncidr.yaml",
            interval: 86400,
        },
        lancidr: {
            type: "http",
            behavior: "ipcidr",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
            path: "./ruleset/lancidr.yaml",
            interval: 86400,
        },
        applications: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
            path: "./ruleset/applications.yaml",
            interval: 86400,
        },
        Reject01: {
        	type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Reject.yaml",
            path: "./Rules/Reject01",
            interval: 86400,
        	},
        Special: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Special.yaml",
            path: "./Rules/Special",
            interval: 86400,
        },
        
    PROXY01: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Proxy.yaml",
            path: "./Rules/Proxy01",
            interval: 86400,
        },
        
    Domestic: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Domestic.yaml",
            path: "./Rules/Domestic",
            interval: 86400,
        },
        
    'Domestic IPs': {
            type: "http", behavior: "ipcidr", url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Domestic%20IPs.yaml",
            path: "./Rules/Domestic_IPs",
            interval: 86400,
        },
        
    LAN: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/LAN.yaml",
            path: "./Rules/LAN",
            interval: 86400,
        },
        
    Netflix: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Netflix.yaml",
            path: "./Rules/Media/Netflix",
            interval: 86400,
        },
        
    Spotify: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Spotify.yaml",
            path: "./Rules/Media/Spotify",
            interval: 86400,
        },
        
    'YouTube Music': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/YouTube%20Music.yaml",
            path: "./Rules/Media/YouTube_Music",
            interval: 86400,
        },
        
    YouTube: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/YouTube.yaml",
            path: "./Rules/Media/YouTube",
            interval: 86400,
        },
        
    Bilibili: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Bilibili.yaml",
            path: "./Rules/Media/Bilibili",
            interval: 86400,
        },
        
    IQ: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/IQ.yaml",
            path: "./Rules/Media/IQI",
            interval: 86400,
        },
        
    IQIYI: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/IQIYI.yaml",
            path: "./Rules/Media/IQYI",
            interval: 86400,
        },
        
    Letv: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Letv.yaml",
            path: "./Rules/Media/Letv",
            interval: 86400,
        },
        
    'Netease Music': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Netease%20Music.yaml",
            path: "./Rules/Media/Netease_Music",
            interval: 86400,
        },
        
    'Tencent Video': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Tencent%20Video.yaml",
            path: "./Rules/Media/Tencent_Video",
            interval: 86400,
        },
        
    Youku: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Youku.yaml",
            path: "./Rules/Media/Youku",
            interval: 86400,
        },
        
    WeTV: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/WeTV.yaml",
            path: "./Rules/Media/WeTV",
            interval: 86400,
        },
        
    ABC: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/ABC.yaml",
            path: "./Rules/Media/ABC",
            interval: 86400,
        },
        
    'Abema TV': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Abema%20TV.yaml",
            path: "./Rules/Media/Abema_TV",
            interval: 86400,
        },
        
    Amazon: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Amazon.yaml",
            path: "./Rules/Media/Amazon",
            interval: 86400,
        },
        
    'Apple Music': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Apple%20Music.yaml",
            path: "./Rules/Media/Apple_Music",
            interval: 86400,
        },
        
    'Apple News': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Apple%20News.yaml",
            path: "./Rules/Media/Apple_News",
            interval: 86400,
        },
        
    'Apple TV': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Apple%20TV.yaml",
            path: "./Rules/Media/Apple_TV",
            interval: 86400,
        },
        
    Bahamut: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Bahamut.yaml",
            path: "./Rules/Media/Bahamut",
            interval: 86400,
        },
        
    'BBC iPlayer': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/BBC%20iPlayer.yaml",
            path: "./Rules/Media/BBC_iPlayer",
            interval: 86400,
        },
        
    DAZN: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/DAZN.yaml",
            path: "./Rules/Media/DAZN",
            interval: 86400,
        },
        
    'Discovery Plus': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Discovery%20Plus.yaml",
            path: "./Rules/Media/Discovery_Plus",
            interval: 86400,
        },
        
    'Disney Plus': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Disney%20Plus.yaml",
            path: "./Rules/Media/Disney_Plus",
            interval: 86400,
        },
        
    encoreTVB: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/encoreTVB.yaml",
            path: "./Rules/Media/encoreTVB",
            interval: 86400,
        },
        
    'F1 TV': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/F1%20TV.yaml",
            path: "./Rules/Media/F1_TV",
            interval: 86400,
        },
        
    'Fox Now': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Fox%20Now.yaml",
            path: "./Rules/Media/Fox_Now",
            interval: 86400,
        },
        
    'Fox+': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Fox%2B.yaml",
            path: "./Rules/Media/Fox+",
            interval: 86400,
        },
        
    'HBO Go': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/HBO%20Go.yaml",
            path: "./Rules/Media/HBO_Go",
            interval: 86400,
        },
        
    'HBO Max': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/HBO%20Max.yaml",
            path: "./Rules/Media/HBO_Max",
            interval: 86400,
        },
        
    'Hulu Japan': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Hulu%20Japan.yaml",
            path: "./Rules/Media/Hulu_Japan",
            interval: 86400,
        },
        
    Hulu: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Hulu.yaml",
            path: "./Rules/Media/Hulu",
            interval: 86400,
        },
        
    Japonx: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Japonx.yaml",
            path: "./Rules/Media/Japonx",
            interval: 86400,
        },
        
    JOOX: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/JOOX.yaml",
            path: "./Rules/Media/JOOX",
            interval: 86400,
        },
        
    KKBOX: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/KKBOX.yaml",
            path: "./Rules/Media/KKBOX",
            interval: 86400,
        },
        
    KKTV: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/KKTV.yaml",
            path: "./Rules/Media/KKTV",
            interval: 86400,
        },
        
    'Line TV': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Line%20TV.yaml",
            path: "./Rules/Media/Line_TV",
            interval: 86400,
        },
        
    'myTV SUPER': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/myTV%20SUPER.yaml",
            path: "./Rules/Media/myTV_SUPER",
            interval: 86400,
        },
        
    Niconico: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Niconico.yaml",
            path: "./Rules/Media/Niconico",
            interval: 86400,
        },
        
    Pandora: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Pandora.yaml",
            path: "./Rules/Media/Pandora",
            interval: 86400,
        },
        
    PBS: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/PBS.yaml",
            path: "./Rules/Media/PBS",
            interval: 86400,
        },
        
    Pornhub: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Pornhub.yaml",
            path: "./Rules/Media/Pornhub",
            interval: 86400,
        },
        
    Soundcloud: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/Soundcloud.yaml",
            path: "./Rules/Media/Soundcloud",
            interval: 86400,
        },
        
    ViuTV: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Media/ViuTV.yaml",
            path: "./Rules/Media/ViuTV",
            interval: 86400,
        },
        
    Telegram: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Telegram.yaml",
            path: "./Rules/Telegram",
            interval: 86400,
        },
        
    Crypto: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Crypto.yaml",
            path: "./Rules/Crypto",
            interval: 86400,
        },
        
    Discord: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Discord.yaml",
            path: "./Rules/Discord",
            interval: 86400,
        },
        
    Steam: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Steam.yaml",
            path: "./Rules/Steam",
            interval: 86400,
        },
        
    Speedtest: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Speedtest.yaml",
            path: "./Rules/Speedtest",
            interval: 86400,
        },
        
    PayPal: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/PayPal.yaml",
            path: "./Rules/PayPal",
            interval: 86400,
        },
        
    Microsoft: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Microsoft.yaml",
            path: "./Rules/Microsoft",
            interval: 86400,
        },
        
    OpenAI: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/OpenAI.yaml",
            path: "./Rules/OpenAI",
            interval: 86400,
        },
        
    Apple01: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Apple.yaml",
            path: "./Rules/Apple01",
            interval: 86400,
        },
        
    'Google FCM': {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Google%20FCM.yaml', path: './Rules/Google FCM'",
            interval: 86400,
        },
        
    Scholar: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/Scholar.yaml",
            path: "./Rules/Scholar",
            interval: 86400,
        },
        
    miHoYo: {
            type: "http",
            behavior: "classical",
            url: "https://testingcf.jsdelivr.net/gh/dler-io/Rules@main/Clash/Provider/miHoYo.yaml",
            path: "./Rules/miHoYo",
            interval: 86400,
        },
    };
    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
}
//覆写代理组
function overwriteProxyGroups(params) {
    // 所有代理
    const allProxies = params["proxies"].map((e) => e.name);
    // 自动选择代理组，按地区分组选延迟最低
    const autoProxyGroupRegexs = [
        { name: "HK-自动选择", regex: /香港|HK|Hong|🇭🇰/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png" },
        { name: "TW-自动选择", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png" },
        { name: "SG-自动选择", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png" },
        { name: "JP-自动选择", regex: /日本|JP|Japan|🇯🇵/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png" },
        { name: "US-自动选择", regex: /美国|US|United States|America|🇺🇸/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png" },
        { name: "HK/SG-自动选择", regex: /香港|HK|Hong|🇭🇰|新加坡|狮城|SG|Singapore|🇸🇬/ },
        { name: "Others-自动选择", regex: /^(?!.*(?:香港|HK|Hong|🇭🇰|台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼|新加坡|SG|Singapore|狮城|🇸🇬|日本|JP|Japan|🇯🇵|美国|US|States|America|🇺🇸|自动|故障|流量|官网|套餐|机场|订阅|年|月)).*$/, icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png" },
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);

    const groups = [
        {
            name: proxyName,
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            //icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png" 
        },
        {
            name: "🎯手动选择",
            type: "select",
            proxies: allProxies,
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png"
        },
        {
            name: "🤖自动选择",
            type: "select",
            //icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
            proxies: ["ALL-自动选择"],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Auto.png"
        },
        {
            name: "🔀负载均衡(散列)",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            //icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            proxies: allProxies,
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Available.png",
        },
        {
            name: "🔁负载均衡(轮询)",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            //icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
            interval: 300,
            "max-failed-times": 3,
            strategy: "round-robin",
            lazy: true,
            proxies: allProxies,
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bypass.png",
        },
        {
            name: "ALL-自动选择",
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "🐟漏网之鱼",
            type: "select",
            proxies: ["DIRECT", proxyName],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png"
        },
        {
            name: "Netflix",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png" 
        },
        {
            name: "Disney",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Disney.png" 
        },
        {
            name: "YouTube",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png" 
        },
        {
            name: "Spotify",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png" 
        },
        {
            name: "Global TV",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png" 
        },
        {
            name: "Apple TV",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple_TV.png" 
        },
        {
            name: "Telegram",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png" 
        },
        {
            name: "Crypto",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Cryptocurrency.png" 
        },
        {
            name: "Discord",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
        icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Discord.png" 
        },    
        {
            name: "Google FCM",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png" 
        },
        {
            name: "OpenAI",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/AI.png" 
        },
        {
            name: "PayPal",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/PayPal.png" 
        },
        {
            name: "Scholar",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Scholar.png" 
        },
        {
            name: "Steam",
            type: "select",
            proxies: [
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
                "DIRECT",
                proxyName
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" 
        },
        {
            name: "Apple",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png" 
        },
        {
            name: "miHoYo",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png" 
        },
        {
            name: "Speedtest",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png" 
        },
        {
            name: "Asian TV",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple_TV_Plus.png" 
        },
        {
            name: "Microsoft",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Microsoft.png" 
        },
        {
            name: "Domestic",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Domestic.png" 
        },
        {
            name: "Domestic IPs",
            type: "select",
            proxies: [
                "DIRECT",
                "🤖自动选择",
                "🎯手动选择",
                "🔀负载均衡(散列)",
                "🔁负载均衡(轮询)",
            ],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Domestic.png" 
        },
        {
            name: "⛔广告拦截",
            type: "select",
            proxies: ["REJECT", "DIRECT", proxyName],
            icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Reject.png" 
        },
    ];

    autoProxyGroups.length &&
        groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    params["proxy-groups"] = groups;
}
//防止dns泄露
function overwriteDns(params) {
    const cnDnsList = [
        "https://223.5.5.5/dns-query",
        "https://1.12.12.12/dns-query",
    ];
    const trustDnsList = [
        'quic://dns.cooluc.com',
        "https://1.0.0.1/dns-query",
        "https://1.1.1.1/dns-query",
    ];
    // const notionDns = 'tls://dns.jerryw.cn'
    // const notionUrls = [
    //     'http-inputs-notion.splunkcloud.com',
    //     '+.notion-static.com',
    //     '+.notion.com',
    //     '+.notion.new',
    //     '+.notion.site',
    //     '+.notion.so',
    // ]
    // const combinedUrls = notionUrls.join(',');
    const dnsOptions = {
        enable: true,
        "prefer-h3": true, // 如果DNS服务器支持DoH3会优先使用h3
        "default-nameserver": cnDnsList, // 用于解析其他DNS服务器、和节点的域名, 必须为IP, 可为加密DNS。注意这个只用来解析节点和其他的dns，其他网络请求不归他管
        nameserver: trustDnsList, // 其他网络请求都归他管

        // 这个用于覆盖上面的 nameserver
        "nameserver-policy": {
            //[combinedUrls]: notionDns,
            "geosite:cn": cnDnsList,
            "geosite:geolocation-!cn": trustDnsList,
            // 如果你有一些内网使用的DNS，应该定义在这里，多个域名用英文逗号分割
            // '+.公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1",
        },
        fallback: trustDnsList,
        "fallback-filter": {
            geoip: true,
            //除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染 geoip-code 配置的国家的结果会直接采用，否则将采用 fallback结果
            "geoip-code": "CN",
            //geosite 列表的内容被视为已污染，匹配到 geosite 的域名，将只使用 fallback解析，不去使用 nameserver
            geosite: ["gfw"],
            ipcidr: ["240.0.0.0/4"],
            domain: ["+.google.com", "+.facebook.com", "+.youtube.com"],
        },
    };

    // GitHub加速前缀
    const githubPrefix = "https://fastgh.lainbo.com/";

    // GEO数据GitHub资源原始下载地址
    const rawGeoxURLs = {
        geoip:
            "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat",
        geosite:
            "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
        mmdb: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb",
    };

    // 生成带有加速前缀的GEO数据资源对象
    const accelURLs = Object.fromEntries(
        Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [
            key,
            `${githubPrefix}${githubUrl}`,
        ])
    );

    const otherOptions = {
        "unified-delay": true,
        "tcp-concurrent": true,
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        sniffer: {
            enable: true,
            sniff: {
                TLS: {
                    ports: [443, 8443],
                },
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
            },
        },
        "geodata-mode": true,
        "geox-url": accelURLs,
    };

    params.dns = { ...params.dns, ...dnsOptions };
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

function getProxiesByRegex(params, regex) {
    return params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
}