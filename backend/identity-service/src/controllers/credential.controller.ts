import { Request, Response } from "express";
import { CryptoService } from "../services/crypto.service";
import { DataSource } from "typeorm";
import { CredentialRecord } from "../entities/CredentialRecord";

export class CredentialController {
  private db: DataSource;

  constructor(dbInstance: DataSource) {
    this.db = dbInstance;
  }

  public issueCredential = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subjectDid, claims } = req.body;
      const issuerPrivateKey = process.env.ISSUER_PRIVATE_KEY!;
      const issuerWallet = new ethers.Wallet(issuerPrivateKey);
      const issuerDid = `did:nexuscore:${issuerWallet.address.toLowerCase()}`;

      const credentialId = `vc:nexuscore:${crypto.randomUUID()}`;
      
      const unsignedPayload = {
        id: credentialId,
        type: ["VerifiableCredential", "NexusCoreIdentityCredential"],
        issuer: issuerDid,
        issuanceDate: new Date().toISOString(),
        credentialSubject: { id: subjectDid, ...claims },
      };

      const signature = CryptoService.signPayload(unsignedPayload, issuerPrivateKey);

      const repo = this.db.getRepository(CredentialRecord);
      const newVC = repo.create({
        id: credentialId,
        subjectDid,
        issuerDid,
        claims,
        signature,
        status: "active",
      });

      await repo.save(newVC);

      res.status(201).json({ success: true, credential: unsignedPayload, proof: { type: "Secp256k1", signature } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}