import express from "express";
const app = express();

app.get("/metrics/aggregate", (req, res) => {
  res.json({ concurrentVerificationsSec: 1420, activeUsersMetric: 981200 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8017);
