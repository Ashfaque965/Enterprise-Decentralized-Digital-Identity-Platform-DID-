import express from "express";
const app = express();

app.get("/authorize", (req, res) => {
  res.json({ trackingToken: crypto.randomUUID(), accessGranted: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8026);
