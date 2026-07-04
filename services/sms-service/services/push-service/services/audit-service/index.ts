import express from "express";
const app = express();

app.post("/audit/log-event", (req, res) => {
  res
    .status(201)
    .json({ indexSequence: 1049281, structuralHashVerified: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8016);
