import express from "express";
const app = express();
app.use(express.json());

app.get("/profile/:id", (req, res) => {
  res.json({ userId: req.params.id, status: "PROVISIONED", residency: "EU" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8002);
