import React from "react";

export const CivilRegistry: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 p-8 text-neutral-100 font-sans">
      <div className="border-b border-neutral-800 pb-4 mb-6">
        <span className="text-xs font-mono px-2 py-0.5 bg-amber-950/50 text-amber-400 border border-amber-900 rounded">
          Federal Tier-1 Hub
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-3">
          Civil Identity Attestation Terminal
        </h1>
      </div>
      <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl">
        <p className="text-sm text-neutral-400">
          Awaiting secure cryptographic root handshakes from authorized local
          registration centers...
        </p>
      </div>
    </div>
  );
};
