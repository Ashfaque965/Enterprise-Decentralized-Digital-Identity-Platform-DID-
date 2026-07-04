import express from "express";
import httpProxy from "express-http-proxy";

const app = express();
const PORT = process.env.PORT || 8000;

const routes = {
  "/api/v1/auth": "http://auth-service:8001",
  "/api/v1/users": "http://user-service:8002",
  "/api/v1/dids": "http://did-service:8004",
  "/api/v1/credentials": "http://credential-service:8005",
};

Object.entries(routes).forEach(([path, target]) => {
  app.use(path, httpProxy(target));
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY", edge: true });
});

app.listen(PORT, () => console.log(`API Gateway routing at port ${PORT}`));
