"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface Credential {
  id: string;
  type: string;
  issuer: string;
  status: string;
}

export default function IdentityDashboard() {
  const [account, setAccount] = useState<string | null>(null);
  const [did, setDid] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Hook into EIP-1193 standard wallet providers
  const connectIdentityWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const userAddress = accounts[0];
        
        setAccount(userAddress);
        setDid(`did:nexuscore:${userAddress.toLowerCase()}`);
        
        // Populate mock telemetry records matching local database sync layouts
        setCredentials([
          { id: "vc:nexuscore:83fa...", type: "UniversityDegree", issuer: "did:nexuscore:0x91b...", status: "active" },
          { id: "vc:nexuscore:102c...", type: "KYCClearance", issuer: "did:nexuscore:0x41a...", status: "active" }
        ]);
      } catch (err) {
        console.error("Wallet discovery authorization rejected:", err);
      }
    } else {
      alert("No secure Web3/DID engine detected. Please load an extension wallet.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Structural Header Grid */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">N</div>
            <span className="font-semibold text-lg tracking-wider text-slate-200">NEXUSCORE <span className="text-cyan-400 font-medium">ID</span></span>
          </div>
          
          <button 
            onClick={connectIdentityWallet}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl text-sm font-medium tracking-wide transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
          >
            {account ? `${account.substring(0,6)}...${account.substring(38)}` : "Connect Sovereign ID"}
          </button>
        </div>
      </header>

      {/* Main Framework Dashboard Grid Layout */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Identity Context Column */}
        <section className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4">Sovereign Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Decentralized Identifier (DID)</label>
              <div className="bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800/80 text-xs font-mono break-all text-slate-300">
                {did || "did:nexuscore:unlinked_identity_anchor"}
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center space-x-3">
              <div className={`h-2.5 w-2.5 rounded-full ${account ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs font-medium text-slate-300">{account ? "Identity Bound Status: Active" : "Status: Awaiting Decentralized Link"}</span>
            </div>
          </div>
        </section>

        {/* Right Verifiable Credentials Inventory Section */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase">Verifiable Credentials Vault</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-slate-400">Total Holdings: {credentials.length}</span>
          </div>

          {credentials.length === 0 ? (
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 text-sm font-medium">
              No off-chain credentials detected inside local index references. Click connect to authorize sync loops.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map((vc) => (
                <div key={vc.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold tracking-wide text-slate-200">{vc.type}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mb-1">ID: {vc.id}</p>
                    <p className="text-[11px] font-mono text-slate-500 break-all">Issuer: {vc.issuer}</p>
                  </div>
                  <button className="mt-5 w-full py-2 bg-slate-900 hover:bg-slate-850 text-xs font-medium text-slate-300 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
                    Generate Selective Zero-Knowledge Proof
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}