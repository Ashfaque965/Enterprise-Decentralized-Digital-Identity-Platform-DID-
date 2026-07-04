import express from "express";
const app = express();

app.post("/webhooks/register-endpoint", (req, res) => {
  res.json({
    webhookId: "wh_0192",
    activeEventSubscriptions: ["credential.revoked"],
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8041);
