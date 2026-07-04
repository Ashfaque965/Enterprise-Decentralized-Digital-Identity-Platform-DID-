"use client";

import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useEffect, useState } from "react";

export interface IdentityProfile {
  did: string;
  accountAddress: string;
  verificationStatus: "Unverified" | "Pending" | "Verified";
  issuedCredentialsCount: number;
}

export function useWeb3Identity() {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<IdentityProfile | null>(null);

  // Synchronize state dynamically if an injected user wallet switches accounts
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchOnChainIdentity(accounts[0]);
        } else {
          setAccount(null);
          setProfile(null);
        }
      };

      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        (window as any).ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      };
    }
  }, []);

  const connectWallet = async () => {
    if (!window || !(window as any).ethereum) {
      alert("Metamask or an injected Web3 wallet provider was not identified.");
      return;
    }

    try {
      setIsLoading(true);
      const web3Provider = new BrowserProvider((window as any).ethereum);
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      const currentSigner = await web3Provider.getSigner();

      setAccount(accounts[0]);
      setSigner(currentSigner);
      await fetchOnChainIdentity(accounts[0]);
    } catch (err) {
      console.error("Wallet connection sequence aborted:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOnChainIdentity = async (walletAddress: string) => {
    // Simulating deterministic verifiable parsing logic
    setProfile({
      did: `did:nexuscore:${walletAddress.toLowerCase()}`,
      accountAddress: walletAddress,
      verificationStatus: "Verified",
      issuedCredentialsCount: 3,
    });
  };

  const executeSelectiveDisclosureProof = async () => {
    if (!signer || !profile) return null;

    try {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      const presentationChallengeMessage = `Sign to authorize identity validation:\nNonce: ${crypto.randomUUID()}\nTimestamp: ${timestamp}`;

      // Request standard EIP-191 cryptographic proof directly from hardware enclaves/wallets
      const clientSignature = await signer.signMessage(
        presentationChallengeMessage,
      );

      return {
        did: profile.did,
        payload: presentationChallengeMessage,
        signature: clientSignature,
      };
    } catch (err) {
      console.error("Cryptographic signing rejected by client:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    account,
    profile,
    isLoading,
    connectWallet,
    executeSelectiveDisclosureProof,
  };
}
