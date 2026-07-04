export type IdentityStatus = "active" | "suspended" | "deactivated";
export type NetworkContext = "evm" | "fabric" | "cosmos";

export interface IVerifiableCredential {
  id: string;
  context: string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: Record<string, any>;
  proof: ICryptographicProof;
}

export interface ICryptographicProof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  jws: string;
}

export interface IAuditEntry {
  logIndex: string;
  originatingService: string;
  actionCode: string;
  computedHash: string;
  executionTimestamp: number;
}
