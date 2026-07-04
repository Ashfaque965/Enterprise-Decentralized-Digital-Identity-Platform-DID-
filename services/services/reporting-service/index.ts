import express from "express";
const app = express();

app.get("/generate/gdpr-export/:did", (req, res) => {
  res.json({
    documentType: "ZIP_ARCHIVE_S3",
    directUrl: "https://s3.nexuscore.internal/exports/1.zip",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8018);
