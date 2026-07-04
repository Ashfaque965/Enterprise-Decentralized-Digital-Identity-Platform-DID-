import "reflect-metadata";
import { DataSource } from "typeorm";

export class SharedDatabaseFactory {
  /**
   * @notice Standardizes connection pool lifecycle behaviors across downstream containers.
   */
  public static createPooledConnection(entitiesArray: any[]): DataSource {
    return new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: 5432,
      username: process.env.DB_USER || "nexus_admin",
      password: process.env.DB_PASSWORD || "production_secure_db_password_2026",
      database: process.env.DB_NAME || "identity_platform",
      entities: entitiesArray,
      synchronize: false, // Always rely on migration structures in production environments
      logging: process.env.NODE_ENV !== "production",
      extra: {
        max: 25, // Optimized maximum connection limit per individual cluster pod unit
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    });
  }
}
