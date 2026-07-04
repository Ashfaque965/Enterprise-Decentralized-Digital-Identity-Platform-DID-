import express from "express";
const app = express();

app.post("/consent/grant", (req, res) => {
  res.json({ status: "RECORDED", temporalDurationHours: 24 });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8010);
