import amqplib, { Channel, Connection } from "amqplib";

export class RabbitMqQueueClient {
  private connection!: Connection;
  private channel!: Channel;

  public async connect(): Promise<void> {
    const url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    this.connection = await amqplib.connect(url);
    this.channel = await this.connection.createChannel();

    // 1. Declare Main and Dead-Letter Exchanges for robust error boundary recovery
    const EXCHANGE_NAME = "nexuscore.identity.direct";
    const DLX_NAME = "nexuscore.identity.dlx";

    await this.channel.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });
    await this.channel.assertExchange(DLX_NAME, "direct", { durable: true });

    // 2. Setup dead-letter queues to gracefully capture failed processing attempts
    await this.channel.assertQueue("verification_failures", { durable: true });
    await this.channel.bindQueue(
      "verification_failures",
      DLX_NAME,
      "fail-routing-key",
    );

    console.log("🐇 RabbitMQ Advanced AMQP Engine topology established.");
  }

  /**
   * @notice Enqueues data targets directly into our persistent, durable message queues
   */
  public publishNotification(routingKey: string, messagePayload: any): boolean {
    const EXCHANGE_NAME = "nexuscore.identity.direct";
    return this.channel.publish(
      EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(messagePayload)),
      { persistent: true },
    );
  }
}
