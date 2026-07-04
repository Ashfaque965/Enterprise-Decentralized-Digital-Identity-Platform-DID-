import { Client } from "@elastic/elasticsearch";

export class AuditLogElasticIndexer {
  private client: Client;
  private static readonly INDEX_NAME = "nexuscore-audit-stream";

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
      auth: {
        username: process.env.ELASTIC_USER || "elastic",
        password: process.env.ELASTIC_PASSWORD || "elastic_pass_2026",
      },
    });
  }

  public async streamLogToElastic(payload: Record<string, any>): Promise<void> {
    try {
      await this.client.index({
        index: AuditLogElasticIndexer.INDEX_NAME,
        document: {
          ...payload,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("🔍 Elasticsearch indexing failure:", error);
    }
  }
}
