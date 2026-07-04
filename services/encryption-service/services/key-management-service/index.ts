import express from "express";
const app = express();

app.post("/kms/rotate-key", (req, res) => {
  res.json({ versionActive: 3, trackingFingerprint: "sha256:019a..." });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8023);
