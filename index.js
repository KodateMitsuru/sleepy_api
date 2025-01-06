const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");
const app = express();
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(REDIS_URL);
const Secret = process.env.SECRECT || "password";

const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "Content-Type"
};

const packageNameToAppName = {
    "com.xiaomi.market": "小米应用商店",
    "com.miui.home": "桌面",
    "com.android.vending": "Google Play 商店",
    "com.coolapk.market": "酷安",
    "com.tencent.mobileqq": "QQ",
    "com.tencent.mm": "微信",
    "com.taobao.taobao": "淘宝",
    "com.xunmeng.pinduoduo": "拼多多",
    "com.jingdong.app.mall": "京东",
    "com.sankuai.meituan": "美团",
    "ctrip.android.view": "携程",
    "com.eg.android.AlipayGphone": "支付宝",
    "com.termux": "Termux",
    "com.suda.yzune.wakeupschedule": "Wake Up 课程表",
    "com.miui.gallery": "相册",
    "com.android.settings": "设置",
    "com.miui.notes": "笔记",
    "com.android.camera": "相机",
    "com.miui.securitycenter": "手机管家",
    "com.miui.weather2": "天气",
    "com.miui.calculator": "计算器",
    "com.miui.video": "小米视频",
    "com.miui.player": "音乐",
    "com.android.deskclock": "时钟",
    "com.android.fileexplorer": "文件管理",
    "com.xiaomi.vipaccount": "小米社区",
    "com.miui.micloudsync": "云服务",
    "com.mipay.wallet": "小米钱包",
    "com.miui.huanji": "小米换机",
    "com.miui.bugreport": "服务与反馈",
    "com.android.contacts": "联系人",
    "com.hz.jp": "慧学车",
    "com.jxedt": "驾校一点通",
    "com.tmri.app.main": "交管12123",
    "cn.com.chsi.chsiapp": "学信网",
    "com.youdao.wisdom": "有道智慧学习",
    "com.youdao.note": "有道云笔记",
    "com.youdao.dict": "网易有道词典",
    "cn.com.langeasy.LangEasyLexis": "不背单词",
    "cn.unipus.cloud": "U校园AI版",
    "com.sflep.course": "WE LEARN",
    "cn.eeo.classin": "ClassIn",
    "com.zmzx.college.search": "大学搜题酱",
    "com.able.wisdomtree": "知到",
    "com.android.calendar": "日历",
    "com.android.email": "电子邮件",
    "com.android.soundrecorder": "录音机",
    "com.miui.screenrecorder": "录屏",
    "com.miui.compass": "指南针",
    "com.xiaomi.scanner": "小爱视觉",
    "com.mi.health": "小米运动健康",
    "com.android.thememanager": "主题商店",
    "com.xiaomi.smarthome": "米家",
    "com.xiaomi.shop": "小米商城",
    "com.android.chrome": "Chrome",
    "com.netease.cloudmusic": "网易云音乐",
    "tv.danmaku.bili": "哔哩哔哩",
    "moe.low.arc": "Arcaea",
    "me.mugzone.malody": "Malody",
    "me.tigerhix.cytoid": "Cytoid",
    "com.rayark.cytus2": "Cytus II",
    "com.rayark.Cytus.full": "Cytus",
    "com.PigeonGames.Phigros": "Phigros",
    "com.nexon.bluearchive": "碧蓝档案",
    "com.google.android.play.games": "Google Play 游戏",
    "bin.mt.plus": "MT管理器",
    "moe.shizuku.privileged.api": "Shizuku",
    "li.songe.gkd": "GKD",
    "com.edifier.edifierconnect": "Edifier Connect",
    "org.kde.kdeconnect_tp": "KDE Connect",
    "com.netvor.hiddensettings": "Hidden Settings",
    "com.moondroplab.moondrop.moondrop_app": "Moondrop",
    "com.looker.droidify": "Droidify",
    "com.valvesoftware.android.steam.community": "Steam",
    "com.valvesoftware.steamlink": "Steam Link",
    "moe.nb4a": "NekoBox",
    "com.twofasapp": "2FAS",
    "ru.tech.imageresizershrinker": "Image Toolbox",
    "com.tan8": "弹琴吧",
    "com.dujiajun.courseblock": "交课表",
    "com.absinthe.libchecker": "LibChecker",
    "com.yubico.yubioath": "Yubico Authenticator",
    "com.wolfram.android.alphapro": "Wolfram Alpha",
    "com.bilibili.studio": "必剪",
    "org.lsposed.lspatch": "LSPatch",
    "com.roamingsoft.manager": "Wifi连接管理器",
    "com.hyperos.aitoolbox": "AI百宝箱",
    "com.termux.boot": "Termux:Boot",
    "com.tencent.wemeet.app": "腾讯会议",
    "edu.sjtu.infoplus.taskcenter": "交我办",
    "cn.wps.moffice_eng": "WPS Office",
    "com.baidu.netdisk": "百度网盘",
    "com.zhihu.android": "知乎",
    "com.baidu.tieba": "百度贴吧",
    "cn.edu.sjtu.pan": "交大云盘",
    "com.dongyueweb.treehole": "亦可赛艇",
    "org.telegram.messenger": "Telegram",
    "com.discord": "Discord",
    "com.ss.android.lark": "飞书",
    "com.ximalaya.ting.android": "喜马拉雅",
    "com.sfacg": "菠萝包轻小说",
    "com.tencent.qqmusic": "QQ音乐",
    "com.chinamworld.bocmbci": "中国银行",
    "com.icbc": "工商银行",
    "com.MobileTicket": "中国铁路12306",
    "com.greenpoint.android.mc10086.activity": "中国移动",
    "com.unionpay": "云闪付",
    "com.app.shanghai.metro": "Metro大都会",
    "com.jiuyu.sptcc.cordova": "上海交通卡",
    "com.autonavi.minimap": "高德地图",
};

app.use(cors(corsOptions));

app.get("/api/status", cors(corsOptions), async (req, res) => {
  try {
    const status = await redis.get("status");
    const modtime = await redis.get("status_mod_time");
    res.json({status: status,modtime: modtime});
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/status", cors(corsOptions), async (req, res) => {
    try {
        const secret = req.body.secret;
        const status = req.body.status;
    
        if (!secret || !status) {
          return res.status(400).json({ error: "Missing secret or status" });
        }

        
        if (secret !== Secret) {
          return res.status(403).json({ error: "Forbidden" });
        }
        const appName = packageNameToAppName[status];
        if (!appName) {
          await redis.set("status", status);
        } else {
          await redis.set("status", appName);
        }
        await redis.set("status_mod_time", Date.now());
        res.status(204).send();
      } catch (e) {
        res.status(500).json({ error: `${e}` });
      }
});


// 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

app.listen(8000, () => console.log("Server running on port 8000"));