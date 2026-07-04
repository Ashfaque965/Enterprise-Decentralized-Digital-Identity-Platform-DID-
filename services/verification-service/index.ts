import express from "express";
const app = express();

app.post("/verify-proof", (req, res) => {
  res.json({ verified: true, matchingPolicy: "AgeOver21 Baseline" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8006);
