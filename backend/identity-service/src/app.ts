import express from "express";
import { DataSource } from "typeorm";
import { CredentialRecord } from "./entities/CredentialRecord";
import { CredentialController } from "./controllers/credential.controller";

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "nexuscore_identity",
  entities: [CredentialRecord],
  synchronize: true, // Only for development/staging environments
});

AppDataSource.initialize()
  .then(() => {
    const credController = new CredentialController(AppDataSource);

    // Business Routing Architecture definitions
    app.post("/api/v1/credentials/issue", credController.issueCredential);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Identity Engine active running on ports mapping to cluster node: ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Database layer failed initialization sequence:", err));