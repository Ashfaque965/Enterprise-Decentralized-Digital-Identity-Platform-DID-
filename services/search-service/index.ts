import express from "express";
const app = express();

app.get("/query/directory", (req, res) => {
  res.json({ schemaHits: [], executionDurationMs: 12 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8029);
