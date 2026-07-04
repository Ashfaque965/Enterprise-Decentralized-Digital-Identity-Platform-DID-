import express from "express";
const app = express();

app.get("/oracle/fetch-external-status", (req, res) => {
  res.json({ dataFeedsActive: true, dynamicAttestationSignature: "0x81b..." });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8033);
