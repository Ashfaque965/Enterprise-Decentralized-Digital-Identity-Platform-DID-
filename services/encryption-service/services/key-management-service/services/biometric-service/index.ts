import express from "express";
const app = express();

app.post("/biometrics/evaluate-hashes", (req, res) => {
  res.json({
    biometricMatchConfidencePercent: 99.84,
    threatSignalDetected: false,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8024);
