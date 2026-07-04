import express from "express";
const app = express();

app.post("/files/chunk-upload", (req, res) => {
  res.json({ chunkId: 4, multiPartUploadSessionComplete: false });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8021);
