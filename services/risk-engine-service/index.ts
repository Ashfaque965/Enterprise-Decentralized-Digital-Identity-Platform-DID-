import express from "express";
const app = express();

app.post("/risk/evaluate-transaction", (req, res) => {
  res.json({ approvalRecommended: true, overallRiskScore: 12 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8036);
