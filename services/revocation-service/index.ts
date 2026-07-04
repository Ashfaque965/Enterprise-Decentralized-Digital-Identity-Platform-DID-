import express from "express";
const app = express();

app.get("/status/:credentialId", (req, res) => {
  res.json({ revoked: false, context: "RevocationList2020Status" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8007);
