import { PactV3, Matchers } from '@pact-foundation/pact';
import path from 'path';
import fetch from 'node-fetch';

const provider = new PactV3({
    consumer: 'NexusCoreWalletConsumer',
    provider: 'NexusCoreCredentialIssuer',
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 4
});

describe('API Contract Verification - Wallet to Identity Issuer Interface', () => {
    it('should successfully match structural JSON signatures returned for explicit credential requests', async () => {
        const expectedRequestPayload = {
            subjectDid: "did:nexus:citizen:12345",
            issuerDid: "did:nexus:org:main-authority",
            credentialType: "KYCIdentityCredential",
            claims: { nationalId: "NEX-99201-AX7" },
            expirationDays: 30
        };

        const expectedResponsePayload = {
            success: true,
            credentialId: Matchers.uuid(),
            data: {
                id: Matchers.string("urn:uuid:credential-mock-id"),
                type: Matchers.eachLike("VerifiableCredential"),
                issuer: "did:nexus:org:main-authority",
                proof: {
                    type: "Ed25519Signature2020",
                    proofValue: Matchers.string("Base64CryptographicSignatureHashString==")
                }
            }
        };

        provider
            .given('Issuer authority engine is active and initialized')
            .uponReceiving('A structurally valid request to generate a verifiable credential')
            .withRequest({
                method: 'POST',
                path: '/api/v1/credentials/issue',
                headers: { 'Content-Type': 'application/json' },
                body: expectedRequestPayload
            })
            .willRespondWith({
                status: 201,
                headers: { 'Content-Type': 'application/json' },
                body: expectedResponsePayload
            });

        await provider.executeTest(async (mockServer) => {
            const response = await fetch(`${mockServer.url}/api/v1/credentials/issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expectedRequestPayload)
            });
            
            const body = await response.json();
            expect(response.status).toBe(201);
            expect(body.success).toBe(true);
            expect(body.data.proof.type).toEqual("Ed25519Signature2020");
        });
    });
});