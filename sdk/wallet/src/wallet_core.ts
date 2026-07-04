import * as ethers from 'ethers';
import crypto from 'crypto';

export interface KeyPairSet {
    publicKeyMultibase: string;
    privateKeyRaw: Buffer;
    address: string;
}

export class NexusWalletCore {
    private mnemonic: string;
    private hdNode: ethers.HDNodeWallet;

    constructor(mnemonic?: string) {
        // Derive or instantiate a zero-trust structural client recovery phrase
        this.mnemonic = mnemonic || ethers.Mnemonic.entropyToMnemonic(crypto.randomBytes(32));
        this.hdNode = ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(this.mnemonic));
    }

    /**
     * Derives application keys deterministically along target validation paths
     * @param index Key index under index paths (e.g., m/44'/60'/0'/0/index)
     */
    public deriveIdentityKeys(index: number = 0): KeyPairSet {
        const derivedWallet = this.hdNode.derivePath(`m/44'/60'/0'/0/${index}`);
        
        // Export public keys in Multibase format for W3C compliance
        const rawPublicKeyBytes = Buffer.from(ethers.getBytes(derivedWallet.publicKey));
        const publicKeyMultibase = `z${rawPublicKeyBytes.toString('hex')}`;

        return {
            publicKeyMultibase,
            privateKeyRaw: Buffer.from(ethers.getBytes(derivedWallet.privateKey)),
            address: derivedWallet.address
        };
    }

    /**
     * Signs challenge objects to prove ownership of a DID during authentication
     */
    public async signAuthenticationChallenge(challenge: string, privateKey: Buffer): Promise<string> {
        const walletInstance = new ethers.Wallet(privateKey.toString('hex'));
        const dynamicChallengeHash = ethers.id(challenge);
        return await walletInstance.signMessage(ethers.getBytes(dynamicChallengeHash));
    }

    public getRecoveryPhrase(): string {
        return this.mnemonic;
    }
}