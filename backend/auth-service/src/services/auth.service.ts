import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

export class AuthService {
  private static challengeCache = new Map<string, { challenge: string; expiry: number }>();
  private static JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_nexuscore_identity_2026";

  /**
   * Step 1: Generates a high-entropy temporary secure random text sequence
   */
  public static generateAuthChallenge(address: string): string {
    const nonce = crypto.randomBytes(32).toString("hex");
    const timestamp = Date.now();
    const challenge = `NexusCore Identity Auth Challenge Request.\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
    
    // Store with a short-lived 5-minute cache lifespan
    this.challengeCache.set(address.toLowerCase(), {
      challenge,
      expiry: timestamp + 5 * 60 * 1000,
    });

    return challenge;
  }

  /**
   * Step 2: Validates the signature and issues a stateless OAuth-compatible access token
   */
  public static verifyChallengeAndIssueToken(address: string, signature: string): string | null {
    const cleanAddress = address.toLowerCase();
    const cacheEntry = this.challengeCache.get(cleanAddress);

    if (!cacheEntry || Date.now() > cacheEntry.expiry) {
      this.challengeCache.delete(cleanAddress);
      return null; // Challenge expired or missing
    }

    try {
      const recoveredAddress = ethers.verifyMessage(cacheEntry.challenge, signature);
      
      if (recoveredAddress.toLowerCase() !== cleanAddress) {
        return null; // Crypto mismatch
      }

      // Evict used challenge immediately to prevent replay vectors
      this.challengeCache.delete(cleanAddress);

      // Generate enterprise microservice session JWT
      const identityDid = `did:nexuscore:${cleanAddress}`;
      return jwt.sign(
        { sub: identityDid, walletAddress: cleanAddress },
        this.JWT_SECRET,
        { expiresIn: "2h", audience: "nexuscore-gateways" }
      );
    } catch {
      return null;
    }
  }
}