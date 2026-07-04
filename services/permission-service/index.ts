import express from "express";
const app = express();

app.get("/permissions/check-bounds", (req, res) => {
  res.json({ permissionScopeAllowed: true, securityLevelRequired: 4 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8028);
