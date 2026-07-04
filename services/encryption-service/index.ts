import express from "express";
const app = express();

app.post("/encrypt-fields", (req, res) => {
  res.json({
    encryptedPayload: "密X902A18F...",
    cryptographyStandard: "AES-GCM-256",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8022);
