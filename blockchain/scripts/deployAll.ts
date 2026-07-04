import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(
    `🚀 Orchestrating deployment with deployer account: ${deployer.address}`,
  );

  const IdentitySBTFactory = await ethers.getContractFactory("IdentitySBT");
  const sbtContract = await IdentitySBTFactory.deploy();
  await sbtContract.waitForDeployment();
  console.log(
    `✅ IdentitySBT compiled and live at: ${await sbtContract.getAddress()}`,
  );

  const IdentityDAOFactory = await ethers.getContractFactory("IdentityDAO");
  const daoContract = await IdentityDAOFactory.deploy();
  await daoContract.waitForDeployment();
  console.log(
    `✅ IdentityDAO compiled and live at: ${await daoContract.getAddress()}`,
  );
}

main().catch((error) => {
  console.error(
    "❌ Fatal exception caught inside script deployment phase execution:",
    error,
  );
  process.exitCode = 1;
});
