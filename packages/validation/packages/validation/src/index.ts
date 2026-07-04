import { z } from "zod";

// Strict validation validation schema mapping dynamic decentralized identifier shapes
export const DidCreationSchema = z.object({
  publicAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{42}$/, {
      message: "Invalid EIP-55 Hex Address profile",
    }),
  documentUri: z
    .string()
    .url({
      message:
        "Metadata endpoint reference pointer must be a fully formed absolute URL URI",
    }),
  networkType: z.enum(["evm", "fabric", "cosmos"]),
});

export const CredentialVerificationSchema = z.object({
  credentialId: z
    .string()
    .startsWith("vc:nexuscore:", {
      message: "Malformed context identifier metadata token configuration",
    }),
  proofSignature: z.string().startsWith("0x"),
});

export type DidCreationInput = z.infer<typeof DidCreationSchema>;
export type CredentialVerificationInput = z.infer<
  typeof CredentialVerificationSchema
>;
