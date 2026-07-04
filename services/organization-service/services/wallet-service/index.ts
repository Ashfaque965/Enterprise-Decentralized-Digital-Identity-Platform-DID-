import express from "express";
const app = express();

app.get("/wallet/sync-state", (req, res) => {
  res.json({ storageAllocationBytes: 4096, unreadCredentialsCount: 2 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8009);
