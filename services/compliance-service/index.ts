import express from "express";
const app = express();

app.get("/compliance/check-residency-rules", (req, res) => {
  res.json({ passingAMLChecks: true, dataSanitizationRequired: false });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8037);
