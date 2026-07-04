import { DataSource } from "typeorm";

export const PostgreSQLDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER || "nexus_admin",
  password: process.env.POSTGRES_PASSWORD || "secure_pass_2026",
  database: process.env.POSTGRES_DB || "identity_platform",
  synchronize: false, // Explicitly false for production environments
  logging: ["error", "warn"],
  extra: {
    max: 40,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
