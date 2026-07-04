import { ethers } from "ethers";

export class EnsIdentityResolver {
  private mainnetProvider: ethers.JsonRpcProvider;

  constructor() {
    // ENS queries rely on underlying Layer 1 mainnet anchors
    this.mainnetProvider = new ethers.JsonRpcProvider(process.env.ETH_MAINNET_RPC || "https://eth.llamarpc.com");
  }

  /**
   * @notice Evaluates a human-readable name string to locate the absolute corresponding blockchain public address
   */
  public async resolveStandardEns(ensName: string): Promise<string | null> {
    try {
      const address = await this.mainnetProvider.resolveName(ensName);
      return address ? address.toLowerCase() : null;
    } catch (error) {
      console.error(`ENS direct resolution error on target ${ensName}:`, error);
      return null;
    }
  }

  /**
   * @notice Executes reverse lookup sweeps to trace user addresses back to verified domain references
   */
  public async reverseLookupAddress(accountAddress: string): Promise<string | null> {
    try {
      const name = await this.mainnetProvider.lookupAddress(accountAddress);
      return name || null;
    } catch (error) {
      console.error(`ENS reverse evaluation path error on address ${accountAddress}:`, error);
      return null;
    }
  }
}