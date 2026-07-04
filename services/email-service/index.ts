import express from "express";
const app = express();

app.post("/send-raw-email", (req, res) => {
  res.json({ sent: true, gatewayMessageId: "smtp-outbound-ok" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8013);
