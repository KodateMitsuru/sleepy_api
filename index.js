const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");
const app = express();
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redis = new Redis(REDIS_URL);
const Secret = process.env.SECRET || "password";

const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "Content-Type"
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
        
        await redis.set("status", status);
        
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