import express from "express";
const app = express();

app.post("/send-otp", (req, res) => {
  res.json({ carrierDispatched: true, validSeconds: 300 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8014);
