import express from "express";
const app = express();

app.post("/dispatch-token-push", (req, res) => {
  res.json({ apnsDeliveryToken: "fcm-delivered-0192" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8015);
