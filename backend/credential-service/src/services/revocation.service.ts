import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

export class RevocationService {
  private provider: ethers.JsonRpcProvider;
  private operatorWallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.operatorWallet = new ethers.Wallet(process.env.ISSUER_PRIVATE_KEY || "", this.provider);
    
    const abi = [
      "function revokeCredential(bytes32 credentialHash) external",
      "function isRevoked(address issuer, bytes32 credentialHash) external view returns (bool)"
    ];
    
    this.contract = new ethers.Contract(process.env.REVOCATION_CONTRACT_ADDRESS || "", abi, this.operatorWallet);
  }

  /**
   * Generates a unique index representation of a credential and broadcasts revocation on-chain
   */
  public async executeOnChainRevocation(credentialId: string): Promise<string> {
    // Generate deterministic sha256 bytes32 commitment hash
    const credentialHash = ethers.solidityPackedKeccak256(["string"], [credentialId]);
    
    console.log(`Bypassing database registries to revoke credential commitment: ${credentialHash}`);
    
    // Broadcast state transition directly to the smart contract
    const tx = await this.contract.revokeCredential(credentialHash);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }
}