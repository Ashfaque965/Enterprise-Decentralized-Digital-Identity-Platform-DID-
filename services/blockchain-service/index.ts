import express from "express";
const app = express();

app.get("/ledger/block-height", (req, res) => {
  res.json({ blockHeight: 4892019, transactionGasPriceGwei: 24 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8032);
