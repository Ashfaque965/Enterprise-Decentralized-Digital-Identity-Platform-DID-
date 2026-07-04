import { ethers } from 'ethers';

export interface DecodedCredential {
    id: string;
    issuer: string;
    type: string[];
    claims: Record<string, any>;
    isValidLifecycle: boolean;
}

export class ClientCredentialVerifier {
    /**
     * Parses and runs localized validation on standard W3C claims strings
     * @param rawJsonVerifiableCredential String containing the full JSON payload
     */
    public static verifyAndParseLocal(rawJsonVerifiableCredential: string): DecodedCredential {
        const parsedVC = JSON.parse(rawJsonVerifiableCredential);

        if (!parsedVC.id || !parsedVC.issuer || !parsedVC.proof) {
            throw new Error("SDK Exception: Malformed credential payload metadata profile.");
        }

        // Verify the credential's validity period
        const currentTime = new Date();
        const expirationTime = new Date(parsedVC.expirationDate);
        const issuanceTime = new Date(parsedVC.issuanceDate);
        
        const isValidLifecycle = currentTime >= issuanceTime && currentTime <= expirationTime;

        return {
            id: parsedVC.id,
            issuer: parsedVC.issuer,
            type: parsedVC.type,
            claims: parsedVC.credentialSubject,
            isValidLifecycle
        };
    }
}