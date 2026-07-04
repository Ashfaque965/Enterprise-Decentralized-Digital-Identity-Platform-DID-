import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign(
    { username, scope: "identity:write" },
    process.env.JWT_SECRET || "fallback",
  );
  res.json({ token });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8001);
