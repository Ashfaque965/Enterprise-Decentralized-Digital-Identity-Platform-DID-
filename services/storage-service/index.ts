import express from "express";
const app = express();

app.get("/storage/object-reference/:id", (req, res) => {
  res.json({
    dataContentEncoding: "base64",
    bucketPartition: "eu-west-1-claims-store",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8020);
