import express from "express";
const app = express();

app.get("/roles/list", (req, res) => {
  res.json({ availableRoles: ["SuperAdmin", "ClaimsAuditor", "VerifierNode"] });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8027);
