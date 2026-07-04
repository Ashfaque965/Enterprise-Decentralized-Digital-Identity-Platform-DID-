import {
  CompareFacesCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";

export class BiometricVerificationEngine {
  private rekognition: RekognitionClient;

  constructor() {
    this.rekognition = new RekognitionClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  /**
   * @notice Compares an onboarding photo against a verified passport or biometric document profile.
   */
  public async verifyLivenessAndMatch(
    liveSessionImageBuffer: Buffer,
    anchorDocumentImageBuffer: Buffer,
  ): Promise<boolean> {
    try {
      const command = new CompareFacesCommand({
        SourceImage: { Bytes: anchorDocumentImageBuffer },
        TargetImage: { Bytes: liveSessionImageBuffer },
        SimilarityThreshold: 95.0, // Enforcing deep enterprise compliance thresholding
      });

      const response = await this.rekognition.send(command);
      if (!response.FaceMatches || response.FaceMatches.length === 0)
        return false;

      const primaryMatch = response.FaceMatches[0];
      return (primaryMatch.Similarity || 0) >= 95.0;
    } catch (error) {
      console.error(
        "👁️ Biometric Verification Engine runtime match exception:",
        error,
      );
      return false;
    }
  }
}
