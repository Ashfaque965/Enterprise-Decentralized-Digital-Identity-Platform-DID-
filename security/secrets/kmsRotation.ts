import {
  CreateKeyCommand,
  KMSClient,
  ScheduleKeyDeletionCommand,
} from "@aws-sdk/client-kms";

export class EnclaveKeyRotationManager {
  private kmsClient: KMSClient;

  constructor() {
    this.kmsClient = new KMSClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  /**
   * @notice Programmatically creates a new active KMS wrap-key target and queues the obsolete ancestor key for lifecycle deletion.
   */
  public async executeKeyRotationCycle(obsoleteKeyId: string): Promise<string> {
    console.log(
      "🔒 Initializing cryptographic root key rotation cycle sequence...",
    );

    // 1. Mint a fresh high-entropy cryptographic reference inside the HSM boundary
    const createCommand = new CreateKeyCommand({
      KeySpec: "ECC_NIST_P256",
      KeyUsage: "SIGN_VERIFY",
      Description: "NexusCore Dynamic Rotating Identity Signing Key Core",
    });

    const createResponse = await this.kmsClient.send(createCommand);
    const brandNewKeyId = createResponse.KeyMetadata?.KeyId;

    if (!brandNewKeyId)
      throw new Error("Failed to instantiate enclave key structure target.");

    // 2. Transition obsolete cryptographic master reference safely out of immediate network usage
    const deleteCommand = new ScheduleKeyDeletionCommand({
      KeyId: obsoleteKeyId,
      PendingWindowInDays: 7, // Safeguard period to recover older verification sessions if required
    });

    await this.kmsClient.send(deleteCommand);
    console.log(
      `🔄 Rotation completed. Active Enclave Target: ${brandNewKeyId}. Obsolete Key scheduled for deletion.`,
    );

    return brandNewKeyId;
  }
}
