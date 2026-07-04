import React, { useState } from "react";

export const VerifyRequest: React.FC = () => {
  const [verificationSessionId, setVerificationSessionId] = useState(
    "session_prod_" + crypto.randomUUID().split("-")[0],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full text-center">
        <h3 className="text-lg font-bold text-slate-900">
          Scan to Verify Identity
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Requires an active multi-tenant zero-knowledge age verification proof
          match.
        </p>

        <div className="my-6 p-6 bg-slate-100 rounded-2xl inline-block border-2 border-dashed border-slate-300">
          <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400 font-mono">
            [QR Code Matrix: {verificationSessionId}]
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-50 py-2 rounded-lg border border-slate-200">
          Active UUID: {verificationSessionId}
        </div>
      </div>
    </div>
  );
};
