import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const IdentityModule = buildModule("IdentityModule", (m) => {
  // 1. Deploy the Soulbound Identity Token Registry
  const identitySBT = m.contract("IdentitySBT");

  // 2. Deploy the Core Identity Governance DAO Engine
  const identityDAO = m.contract("IdentityDAO");

  // 3. Deploy the Trust Infrastructure using the DAO as the Governance Root
  const governanceTrustRegistry = m.contract("GovernanceTrustRegistry", [
    identityDAO,
  ]);

  return { identitySBT, identityDAO, governanceTrustRegistry };
});

export default IdentityModule;
