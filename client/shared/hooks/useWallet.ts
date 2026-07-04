import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("No Web3 provider detected. Please install Metamask or an alternative DID Wallet provider.");
      return;
    }
    
    try {
      setIsConnecting(true);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      
      setAccount(accounts[0]);
      setProvider(browserProvider);
    } catch (error) {
      console.error("Wallet connectivity error:", error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: any) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    }
  }, []);

  return { account, provider, isConnecting, connectWallet };
};