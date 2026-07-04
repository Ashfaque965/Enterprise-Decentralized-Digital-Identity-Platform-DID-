import express from "express";
const app = express();

app.post("/streams/logs", (req, res) => {
  res.status(202).send();
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8030);
