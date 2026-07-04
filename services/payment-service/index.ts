import express from "express";
const app = express();

app.post("/charge/verification-gas", (req, res) => {
  res.json({ chargeSucceeded: true, internalBillingId: "tx_pay_092a" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8038);
