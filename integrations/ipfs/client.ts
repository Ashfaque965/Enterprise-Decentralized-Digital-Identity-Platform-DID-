import { json } from "@helia/json";
import { createHelia } from "helia";
import { CID } from "multiformats/cid";

export class IpfsStorageClient {
  private heliaInstance: any;
  private jsonStore: any;

  public async initialize(): Promise<void> {
    this.heliaInstance = await createHelia();
    this.jsonStore = json(this.heliaInstance);
    console.log(
      "🌐 Helia IPFS node spun up successfully inside runtime container memory space.",
    );
  }

  /**
   * @notice Persists an encrypted verifiable credential string to the IPFS decentralized network.
   */
  public async uploadEncryptedPayload(
    encryptedJson: Record<string, any>,
  ): Promise<string> {
    const rawCid = await this.jsonStore.add(encryptedJson);
    return rawCid.toString();
  }

  /**
   * @notice Fetches content directly from peer pools using its hash representation.
   */
  public async resolveEncryptedPayload(
    cidString: string,
  ): Promise<Record<string, any>> {
    const targetCid = CID.parse(cidString);
    return await this.jsonStore.get(targetCid);
  }
}
