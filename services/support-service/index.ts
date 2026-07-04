import express from "express";
const app = express();

app.post("/tickets/create", (req, res) => {
  res.status(201).json({ supportTicketId: "NEXUS-HELP-4029", status: "OPEN" });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8040);
