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
    "com.android.vending": "Google Play 商店",
    "com.coolapk.market": "Coolapk",
    "com.tencent.mobileqq": "QQ",
    "com.tencent.mm": "微信",
    "com.taobao.taobao": "淘宝",
    "com.xunmeng.pinduoduo": "拼多多",
    "com.jingdong.app.mall": "京东",
    "com.sankuai.meituan": "美团",
    "ctrip.android.view": "携程",
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