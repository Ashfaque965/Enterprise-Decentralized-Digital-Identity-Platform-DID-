import React, { useEffect, useState } from "react";

interface IdentityClaim {
  id: string;
  type: string;
  issuer: string;
  status: "ACTIVE" | "REVOKED";
}

export const UserDashboard: React.FC = () => {
  const [claims, setClaims] = useState<IdentityClaim[]>([]);

  useEffect(() => {
    // Resolve target user identity assertions on mounting
    setClaims([
      {
        id: "urn:uuid:1",
        type: "NationalID",
        issuer: "did:nexus:gov:authority",
        status: "ACTIVE",
      },
      {
        id: "urn:uuid:2",
        type: "DriverLicense",
        issuer: "did:nexus:gov:dmv",
        status: "ACTIVE",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Citizen Identity Safe
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your verifiable credentials and cryptographic personas.
        </p>
      </header>
      <main className="grid gap-6 md:grid-cols-2">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {claim.type}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {claim.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-4 font-mono truncate">
              Issuer: {claim.issuer}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
};
