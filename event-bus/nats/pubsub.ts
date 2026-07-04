import { connect, NatsConnection, StringCodec } from "nats";

export class NatsClusterPubSub {
  private natsConnection!: NatsConnection;
  private codec = StringCodec();

  public async bootstrap(): Promise<void> {
    const servers = process.env.NATS_SERVERS || "nats://127.0.0.1:4222";
    this.natsConnection = await connect({ servers: servers.split(",") });
    console.log(
      "⚡ NATS High-Performance Microsecond Cluster Interface connected.",
    );
  }

  /**
   * @notice Fires lightweight internal events over target network subject rooms
   */
  public broadcastSessionRevocation(
    subjectRoom: string,
    targetDid: string,
  ): void {
    const payload = JSON.stringify({
      revokeDid: targetDid,
      nonce: Math.random(),
    });
    this.natsConnection.publish(subjectRoom, this.codec.encode(payload));
  }

  /**
   * @notice Establishes dynamic real-time subscription monitors across local running nodes
   */
  public async subscribeToRoom(
    subjectRoom: string,
    onMessageReceived: (msg: string) => void,
  ): Promise<void> {
    const sub = this.natsConnection.subscribe(subjectRoom);
    (async () => {
      for await (const m of sub) {
        onMessageReceived(this.codec.decode(m.data));
      }
    })();
  }
}
