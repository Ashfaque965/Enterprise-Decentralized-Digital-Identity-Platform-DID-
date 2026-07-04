import { createCluster, RedisClusterType } from "redis";

export class RedisClusterManager {
  private static cluster: RedisClusterType;

  public static async initialize(): Promise<RedisClusterType> {
    if (this.cluster) return this.cluster;

    this.cluster = createCluster({
      rootNodes: [
        { url: process.env.REDIS_NODE_1 || "redis://127.0.0.1:6379" },
        { url: process.env.REDIS_NODE_2 || "redis://127.0.0.1:6380" },
      ],
      defaults: {
        password: process.env.REDIS_PASSWORD || "secure_cache_pass_2026",
      },
    });

    this.cluster.on("error", (err) =>
      console.error("⚡ Redis Cluster Error:", err),
    );
    await this.cluster.connect();
    console.log("⚡ Redis High-Availability Sharded Cluster connected.");
    return this.cluster;
  }
}
