import express from "express";
const app = express();
app.use(express.json());

app.post("/issue", (req, res) => {
  res.json({
    id: "urn:uuid:" + crypto.randomUUID(),
    type: ["VerifiableCredential"],
    issuanceDate: new Date().toISOString(),
    credentialSubject: req.body.subjectData,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8005);
