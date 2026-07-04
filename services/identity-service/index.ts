import express from "express";
const app = express();

app.post("/identities/bind", (req, res) => {
  res
    .status(201)
    .json({ identityGraphId: crypto.randomUUID(), synchronized: true });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8003);
