import { ethers } from "ethers";

export class CoreCryptoEngine {
  /**
   * @notice Validates cryptographic digital signature assertions securely.
   */
  public static verifyDeviceSignature(
    signerAddress: string,
    rawMessage: string,
    hexSignature: string,
  ): boolean {
    try {
      const parsedMessageHash = ethers.hashMessage(rawMessage);
      const recoveredAddress = ethers.recoverAddress(
        parsedMessageHash,
        hexSignature,
      );
      return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  /**
   * @notice Derives standard deterministic Keccak256 hash targets for content registry keys.
   */
  public static computeKeccak256(payload: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(payload));
  }
}
