import express from "express";
const app = express();

app.get("/tenant/:orgId", (req, res) => {
  res.json({
    organizationId: req.params.orgId,
    trustTier: "GOV_PARTNER_CLASS_A",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8008);
