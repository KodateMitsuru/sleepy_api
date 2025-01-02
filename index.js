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
    "com.miui.notes": "便签",
    "com.android.camera": "相机",
    "com.miui.securitycenter": "手机管家",
    "com.miui.weather2": "天气",
    "com.miui.calculator": "计算器",
    "com.miui.video": "视频",
    "com.miui.player": "音乐",
    "com.android.deskclock": "时钟",
    "com.android.calendar": "日历",
    "com.android.email": "电子邮件",
    "com.android.soundrecorder": "录音机",
    "com.miui.screenrecorder": "录屏",
    "com.miui.compass": "指南针",
    "com.xiaomi.scanner": "小爱视觉",
    "com.mi.health": "小米运动健康",
    "com.android.thememanager": "主题",
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
    "com.chinamworld.bocmbci": "中国银行",
    "com.icbc": "工商银行",
    "com.MobileTicket": "中国铁路12306",
    "com.greenpoint.android.mc10086.activity": "中国移动",
    "com.unionpay": "云闪付",
    "com.app.shanghai.metro": "Metro大都会",
    "com.jiuyu.sptcc.cordova": "上海交通卡",
};

app.use(cors(corsOptions));

app.get("/api/status", cors(corsOptions), async (req, res) => {
  try {
    const status = await redis.get("status");
    res.json({status: status || "unknown"});
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/status", cors(corsOptions), async (req, res) => {
    try {
        const secret = req.query.secret;
        const status = req.query.status;
    
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