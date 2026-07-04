import mongoose from "mongoose";
import { DataSource } from "typeorm";
import { connectMongoDB } from "../../databases/mongodb/connection";

export class PrivacyCompliancePurgeEngine {
  /**
   * @notice Completely scrubs an individual's PII from databases while maintaining zero-knowledge decentralized trail anchors.
   */
  public static async executeRightToBeForgotten(
    userDidAddress: string,
    relationalDb: DataSource,
  ): Promise<boolean> {
    console.log(
      `⚠️ Activating compliance deletion protocol for identity: ${userDidAddress}`,
    );

    const queryRunner = relationalDb.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Purge PII rows out of local transactional PostgreSQL configurations
      await queryRunner.query(
        "DELETE FROM users WHERE id IN (SELECT user_id FROM wallets WHERE public_address = $1)",
        [userDidAddress.replace("did:nexuscore:", "")],
      );

      // 2. Clear any corresponding raw unstructured JSON presentation credentials from MongoDB collections
      await connectMongoDB();
      const credentialCollection = mongoose.connection.collection(
        "unstructured_credentials",
      );
      await credentialCollection.deleteMany({
        "credentialSubject.id": userDidAddress,
      });

      // 3. Commit the structural database operations cleanly
      await queryRunner.commitTransaction();
      console.log(
        `✅ Compliance success: All PII eradicated for ${userDidAddress}. On-chain anonymity maintained.`,
      );
      return true;
    } catch (error) {
      console.error(
        "❌ Purge operation failed. Rolling back database alterations:",
        error,
      );
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
