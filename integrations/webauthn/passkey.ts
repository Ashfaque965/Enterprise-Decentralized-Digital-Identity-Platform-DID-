import { SimpleWebAuthnServer } from "@simplewebauthn/server";

export class WebAuthnPasskeyEngine {
  private static readonly EXPECTED_ORIGIN =
    "https://identity.nexuscore.network";
  private static readonly RP_ID = "identity.nexuscore.network";

  /**
   * @notice Validates cryptographic key challenges sent from end-user enclave hardware devices.
   */
  public static async verifyAuthenticationResponse(
    storedCredentialPublicKey: string,
    storedCurrentNonce: string,
    inboundBodyPayload: any,
  ): Promise<boolean> {
    try {
      const verification =
        await SimpleWebAuthnServer.verifyAuthenticationResponse({
          response: inboundBodyPayload,
          expectedChallenge: storedCurrentNonce,
          expectedOrigin: this.EXPECTED_ORIGIN,
          expectedRPID: this.RP_ID,
          authenticator: {
            credentialID: Buffer.from(inboundBodyPayload.id, "base64url"),
            credentialPublicKey: Buffer.from(storedCredentialPublicKey, "hex"),
            counter: inboundBodyPayload.response.authenticatorData.counter || 0,
          },
        });

      return verification.verified;
    } catch (error) {
      console.error(
        "🔒 WebAuthn/Passkey Engine assertion evaluation rejected:",
        error,
      );
      return false;
    }
  }
}
