import express from "express";
const app = express();

app.get("/resolve/:did", (req, res) => {
  res.json({
    "@context": "https://www.w3.org/ns/did/v1",
    id: req.params.did,
    verificationMethod: [
      { id: `${req.params.did}#key-1`, type: "JsonWebKey2020" },
    ],
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8004);
