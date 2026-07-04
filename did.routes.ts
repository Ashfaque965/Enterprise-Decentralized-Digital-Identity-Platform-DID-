import { Router, Response } from "express";
import { AuthenticatedRequest, tokenAuthMiddleware } from "../middleware/auth.middleware";
import { ethers } from "ethers";

const router = Router();

// Mock instance representing your BlockchainService integration layer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");

router.post("/did/create", tokenAuthMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { documentUri } = req.body;
    const userDid = req.userDid; // Ingested implicitly from verification middleware

    if (!documentUri) {
      res.status(400).json({ success: false, error: "Missing off-chain document pointer reference." });
      return;
    }

    // In production, this relays the signed call data payload to DIDRegistry.sol via a gas relayer
    const mockTxHash = ethers.keccak256(ethers.toUtf8Bytes(Date.now().toString()));

    res.status(201).json({
      success: true,
      did: userDid,
      documentUri,
      blockchainAnchor: {
        txHash: mockTxHash,
        status: "confirmed"
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export const DidRouter = router;