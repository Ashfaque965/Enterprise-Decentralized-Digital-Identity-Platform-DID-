import { Router, Request, Response } from "express";
import { tokenAuthMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import crypto from "crypto";
import { ethers } from "ethers";

const router = Router();

router.post("/credential/issue", tokenAuthMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { targetSubjectDid, claimsData } = req.body;
    const issuerDid = req.userDid;

    if (!targetSubjectDid || !claimsData) {
      res.status(400).json({ success: false, error: "Missing target identifier or claim payloads." });
      return;
    }

    const credentialId = `vc:nexuscore:${crypto.randomUUID()}`;
    const unsignedPayload = {
      id: credentialId,
      type: ["VerifiableCredential", "EnterpriseIdentity"],
      issuer: issuerDid,
      issuanceDate: new Date().toISOString(),
      credentialSubject: { id: targetSubjectDid, ...claimsData }
    };

    // Use issuer private key from environment/vault layer to sign payload
    const wallet = new ethers.Wallet(process.env.ISSUER_PRIVATE_KEY || ethers.Wallet.createRandom().privateKey);
    const messageHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(unsignedPayload)));
    const proofSignature = wallet.signingKey.sign(messageHash).serialized;

    res.status(201).json({
      success: true,
      credentialId,
      verifiableCredential: {
        ...unsignedPayload,
        proof: {
          type: "JsonWebSignature2020",
          proofPurpose: "assertionMethod",
          verificationMethod: `${issuerDid}#key-1`,
          jws: proofSignature
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const CredentialRouter = router;