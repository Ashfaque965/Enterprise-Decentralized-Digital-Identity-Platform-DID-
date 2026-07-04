import express from "express";
const app = express();

app.post("/documents/parse-metadata", (req, res) => {
  res.json({
    targetMimeType: "application/pdf",
    extractedSchemaFieldsCount: 8,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "HEALTHY" });
});
app.listen(8019);
