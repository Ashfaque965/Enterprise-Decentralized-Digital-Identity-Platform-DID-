import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NexusCore Decoupled Identity Contract Platform Integrations", () => {
  let identitySBT: any;
  let deployer: SignerWithAddress;
  let userAccount: SignerWithAddress;

  beforeEach(async () => {
    [deployer, userAccount] = await ethers.getSigners();

    const SBTFactory = await ethers.getContractFactory("IdentitySBT");
    identitySBT = await SBTFactory.deploy();
    await identitySBT.waitForDeployment();
  });

  describe("Soulbound Registry Lifecycle Restrictions", () => {
    it("Should allow the authorized deployer to mint dynamic profile indices", async () => {
      const mockMetadataUri =
        "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

      await expect(
        identitySBT.mintIdentity(userAccount.address, mockMetadataUri),
      )
        .to.emit(identitySBT, "ProfileMinted")
        .withArgs(userAccount.address, 1n, mockMetadataUri);

      expect(await identitySBT.addressToTokenId(userAccount.address)).to.equal(
        1n,
      );
    });

    it("Should fail and block executions if holders attempt profile identity transfers", async () => {
      const mockMetadataUri = "ipfs://QmXoyp...";
      await identitySBT.mintIdentity(userAccount.address, mockMetadataUri);

      // Verify explicit transfer blocks for Soulbound tokens
      await expect(
        identitySBT
          .connect(userAccount)
          .transferFrom(userAccount.address, deployer.address, 1n),
      ).to.be.revertedWith(
        "IdentitySBT: Token is Soulbound and non-transferable.",
      );
    });
  });
});
