import express from "express";
const app = express();

app.get("/subscription/quota-status/:orgId", (req, res) => {
  res.json({
    internalPlanTier: "ENTERPRISE_UNLIMITED",
    APIQuotaCallsRemaining: 999999,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8039);
