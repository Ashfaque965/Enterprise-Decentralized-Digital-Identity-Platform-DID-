"use client";

import { WalletButton } from "@/components/WalletButton";
import { useWeb3Identity } from "@/hooks/useWeb3Identity";
import { useState } from "react";

export default function Home() {
  const {
    account,
    profile,
    isLoading,
    connectWallet,
    executeSelectiveDisclosureProof,
  } = useWeb3Identity();
  const [proofResult, setProofResult] = useState<any | null>(null);

  const handleIdentityVerification = async () => {
    const verifiedProof = await executeSelectiveDisclosureProof();
    if (verifiedProof) {
      setProofResult(verifiedProof);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Platform Header Global Navigation */}
      <header className="border-b border-slate-900 px-6 py-4 flex justify-between items-center bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-mono font-bold tracking-wider uppercase text-slate-200">
            NexusCore ID Portal
          </span>
        </div>
        <WalletButton
          account={account}
          onConnect={connectWallet}
          isLoading={isLoading}
        />
      </header>

      {/* Main Panel Ingress Layout */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-center">
        {!account ? (
          <div className="text-center space-y-6 py-12 border border-slate-900 rounded-2xl bg-slate-900/20 max-w-md mx-auto px-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Decentralized Trust Verification Gateway
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Authenticate via zero-knowledge presentation tokens. Link your
              cold storage or enclave identity key vector to access
              authenticated networks.
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-100 font-medium py-3 px-4 rounded-xl border border-slate-800 transition-all"
            >
              Initialize Handshake
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Column A: Decentralized Identity Record Profiles */}
            <div className="md:col-span-1 border border-slate-900 bg-slate-900/30 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                Active Identity Record
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-500">
                    Decentralized Identifier (DID)
                  </label>
                  <p className="text-xs font-mono break-all text-slate-300 mt-0.5">
                    {profile?.did}
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-500">
                    Security Clearance Attestation
                  </label>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {profile?.verificationStatus}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleIdentityVerification}
                disabled={isLoading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl transition-all"
              >
                Sign Verification Presentation
              </button>
            </div>

            {/* Column B: Real-Time Verified Proof Verification Log */}
            <div className="md:col-span-2 space-y-4">
              <div className="border border-slate-900 bg-slate-900/10 rounded-2xl p-5 min-h-[260px] flex flex-col">
                <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
                  W3C Compliance JSON Payload Logs
                </h2>
                {proofResult ? (
                  <div className="flex-1 flex flex-col space-y-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex-1 overflow-x-auto max-h-[300px]">
                      <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                        {JSON.stringify(proofResult, null, 2)}
                      </pre>
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      ✓ Message signed using standard cryptography. Ready for
                      zero-knowledge gateway transmission.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-slate-900 rounded-xl p-8 text-center">
                    <p className="text-xs font-mono text-slate-500">
                      No active cryptographic signature found. Trigger a
                      presentation challenge to view logs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
