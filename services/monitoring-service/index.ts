import express from "express";
const app = express();

app.get("/telemetry/diagnostics", (req, res) => {
  res.json({ kubernetesPodsHealthy: true, activeMeshConnections: 450 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8031);
