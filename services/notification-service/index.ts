import express from "express";
const app = express();

app.post("/route", (req, res) => {
  res.json({ status: "QUEUED", trackingId: crypto.randomUUID() });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8012);
