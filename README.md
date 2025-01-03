# sleepy_api

sleepy api only version

| 路径                            | 方法 | 作用                | 返回（成功） |
| ------------------------------- | ---- | ------------------- | ------------ |
| `/api/status`                 | GET  | 获取状态            |{status: status,modtime: modtime}|
| `/api/status?secret=&status=` | POST | 设置状态 (url 参数) |204              |

