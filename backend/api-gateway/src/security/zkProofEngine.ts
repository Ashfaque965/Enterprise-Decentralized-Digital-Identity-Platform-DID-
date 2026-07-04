import * as snarkjs from "snarkjs";
import * as fs from "fs";

export interface ProofPayload {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
}

export class ZkProofEngine {
  private static readonly WASM_PATH = "./dist/circuits/ageCheck.wasm";
  private static readonly ZKEY_PATH = "./dist/circuits/ageCheck_final.zkey";
  private static readonly VKEY_JSON_PATH = "./dist/circuits/verification_key.json";

  /**
   * @notice Compiles local private attributes into a cryptographically valid zk-SNARK Groth16 Proof
   */
  public static async generateProof(
    birthTimestamp: number,
    currentTimestamp: number,
    thresholdDuration: number
  ): Promise<{ proof: ProofPayload; publicSignals: string[] }> {
    
    const circuitInputs = {
      birthTimestamp: birthTimestamp.toString(),
      currentTimestamp: currentTimestamp.toString(),
      thresholdDuration: thresholdDuration.toString()
    };

    // Calculate witness values and generate the Groth16 zero-knowledge proof payload
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInputs,
      this.WASM_PATH,
      this.ZKEY_PATH
    );

    return { proof, publicSignals };
  }

  /**
   * @notice Validates an incoming zero-knowledge proof asset against public operational parameters
   */
  public static async verifyProof(proof: ProofPayload, publicSignals: string[]): Promise<boolean> {
    try {
      // Ingest the immutable verification template file from secure disk volumes
      const vKey = JSON.parse(fs.readFileSync(this.VKEY_JSON_PATH, "utf8"));
      
      // Execute the zero-knowledge validation matrix step
      const verificationResult = await snarkjs.groth16.verify(vKey, publicSignals, proof);
      
      // Ensure the output constraint flag equals '1' (Criteria Successfully Proven)
      const executionFlagOk = publicSignals[0] === "1";

      return verificationResult && executionFlagOk;
    } catch (error) {
      console.error("ZK Engine internal validation exception caught:", error);
      return false;
    }
  }
}