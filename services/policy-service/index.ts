import express from "express";
const app = express();

app.get("/evaluate/policy-set/:id", (req, res) => {
  res.json({ evaluationResult: "PERMIT", evaluatedConstraintsCount: 14 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8025);
