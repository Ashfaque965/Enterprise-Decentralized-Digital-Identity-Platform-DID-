import { Kafka, Producer, RecordMetadata } from "kafkajs";

export class KafkaIdentityProducer {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "nexuscore-identity-bus",
      brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    });
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionalId: "nexuscore-tx-identity-producer",
    });
  }

  public async initialize(): Promise<void> {
    await this.producer.connect();
    console.log("🦫 Apache Kafka Transactional Identity Producer connected.");
  }

  /**
   * @notice Publishes a state mutation event with strict partitioning guarantees
   */
  public async streamEvent(
    topic: string,
    partitionKey: string,
    payload: Record<string, any>,
  ): Promise<RecordMetadata[]> {
    return await this.producer.send({
      topic,
      messages: [
        {
          key: partitionKey,
          value: JSON.stringify({
            ...payload,
            emittedAt: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }
}
