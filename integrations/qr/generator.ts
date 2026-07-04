import QRCode from "qrcode";

export class SecureQrGenerator {
  /**
   * @notice Compiles string vectors into base64 visual matrices for device rendering.
   */
  public static async renderSecureOfferMatrix(
    protocolUrlString: string,
  ): Promise<string> {
    try {
      // Enforce high-density error correction parameters to protect against display glare
      return await QRCode.toDataURL(protocolUrlString, {
        errorCorrectionLevel: "H",
        margin: 2,
        color: {
          dark: "#0f172a", // Tailored to slate-900 palettes
          light: "#ffffff",
        },
      });
    } catch (error) {
      console.error(
        "🔮 QR Generator instantiation processing error caught:",
        error,
      );
      throw new Error("Failed to compile target matrix schema.");
    }
  }
}
