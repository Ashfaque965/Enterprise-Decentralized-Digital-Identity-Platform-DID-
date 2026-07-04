import { ethers } from "ethers";
import mongoose from "mongoose";
import { connectMongoDB } from "../../databases/mongodb/connection";
import { SharedDatabaseFactory } from "../../packages/database/src/index";

// Barebones inline entity mapping to circumvent strict circular reference dependencies during provisioning steps
class UserSeedEntity {
  static SCHEMALESS_NAME = "users";
}

async function runStorageSeeder() {
  console.log(
    "🌱 Activating relational and document seed generation engine...",
  );

  // 1. Establish data persistent connections
  const postgresStore = SharedDatabaseFactory.createPooledConnection([]);
  await postgresStore.initialize();
  await connectMongoDB();

  const queryRunner = postgresStore.createQueryRunner();
  await queryRunner.connect();

  try {
    const mongoCollection = mongoose.connection.collection(
      "unstructured_credentials",
    );

    console.log(
      "⚡ Injecting 500 mock identity credentials into distributed stores...",
    );

    for (let i = 0; i < 500; i++) {
      // Create test keys using standard random vectors
      const ephemeralWallet = ethers.Wallet.createRandom();
      const userUuid = crypto.randomUUID();

      // A. Populate relational structure records
      await queryRunner.query(
        `INSERT INTO users (id, email, status) VALUES ($1, $2, 'active')`,
        [userUuid, `developer_test_profile_${i}@nexuscore.network`],
      );

      await queryRunner.query(
        `INSERT INTO wallets (user_id, public_address) VALUES ($1, $2)`,
        [userUuid, ephemeralWallet.address.toLowerCase()],
      );

      // B. Structure corresponding verifiable document records matching W3C standards
      const mockCredentialPayload = {
        id: `vc:nexuscore:mock_seed_token_${i}`,
        context: ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiableCredential", "NexusCoreDeveloperAttestation"],
        issuer: "did:nexuscore:authority_root_node",
        credentialSubject: {
          id: `did:nexuscore:${ephemeralWallet.address.toLowerCase()}`,
          identityClass: "Tier-3-Verified-Developer",
          associatedTelemetryIndex: i,
        },
        proof: {
          type: "JsonWebSignature2020",
          proofPurpose: "assertionMethod",
          verificationMethod: "did:nexuscore:authority_root_node#key-1",
          jws: "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCjFcdc...",
        },
      };

      await mongoCollection.insertOne(mockCredentialPayload);
    }

    console.log(
      "✅ Database matrix targets successfully provisioned with operational test keys.",
    );
  } catch (error) {
    console.error(
      "❌ Seeding halted due to critical data execution failure:",
      error,
    );
  } finally {
    await queryRunner.release();
    await postgresStore.destroy();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runStorageSeeder();
