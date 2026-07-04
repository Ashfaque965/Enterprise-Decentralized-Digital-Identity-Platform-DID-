import { expect } from "chai";
import { ethers } from "ethers";

describe("⛓️ Multi-Contract Decentralized Lifecycle Assertions", () => {
  let provider: ethers.JsonRpcProvider;
  let administratorWallet: ethers.Wallet;
  let testIdentityAddress: string;

  // Pre-compiled functional ABI mappings targeting deployed smart contracts
  const registryAbi = [
    "function createDID(string calldata did, string calldata documentUri) external",
    "function getDIDDocument(string calldata did) external view returns (string memory)",
  ];

  beforeAll(async () => {
    provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || "http://127.0.0.1:8545",
    );
    administratorWallet = new ethers.Wallet(
      process.env.DEPLOYER_PRIVATE_KEY || "0xabc123...",
      provider,
    );
    testIdentityAddress = "0x921A377bc547B2B64F1e56bE0E99318b3fD2896F";
  });

  it("Should process identity anchors correctly on-chain and prevent duplicate identifier state updates", async () => {
    const contractAddress =
      process.env.DID_REGISTRY_ADDRESS ||
      "0x0000000000000000000000000000000000000000";
    const registryInstance = new ethers.Contract(
      contractAddress,
      registryAbi,
      administratorWallet,
    );

    const uniqueDidToken = `did:nexuscore:${testIdentityAddress.toLowerCase()}`;
    const metadataLink =
      "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

    console.log(
      `Writing decentralized token entry to blockchain registry: ${uniqueDidToken}`,
    );

    // 1. Execute initial decentralized asset anchor transaction
    const txResponse = await registryInstance.createDID(
      uniqueDidToken,
      metadataLink,
    );
    const receipt = await txResponse.wait();

    expect(receipt.status).toEqual(1); // Ensure transaction execution returned true

    // 2. Run read-validation queries against ledger smart contract nodes
    const savedDocumentEndpoint =
      await registryInstance.getDIDDocument(uniqueDidToken);
    expect(savedDocumentEndpoint).toEqual(metadataLink);

    // 3. Confirm the contract rejects unauthorized modifications to existing records
    try {
      await registryInstance.createDID(
        uniqueDidToken,
        "ipfs://malicious_override_link",
      );
      fail(
        "Security Interceptor Error: Duplicate key overwrite allowed on contract registry.",
      );
    } catch (contractException: any) {
      expect(contractException.message).toContain("revert");
      console.log(
        "✅ Ledger security integration validated: Overwrite requests rejected safely.",
      );
    }
  });
});
