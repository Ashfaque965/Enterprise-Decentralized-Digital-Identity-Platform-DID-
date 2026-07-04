import express from "express";
import dotenv from "dotenv";
import { DidRouter } from "./routes/did.routes";
import { CredentialRouter } from "./routes/credential.routes";
import { ZkRouter } from "./routes/zk.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Mount Unified Orchestration API Matrix
app.use("/api/v1", DidRouter);
app.use("/api/v1", CredentialRouter);
app.use("/api/v1", ZkRouter);

// Global Health Checking endpoint for Kubernetes Ingress Controller
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", systemTime: new Date().toISOString() });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🌐 Enterprise Identity API Edge Gateway active on routing port: ${PORT}`);
});