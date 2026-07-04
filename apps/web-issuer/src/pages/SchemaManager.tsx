import React, { useState } from "react";

export const SchemaManager: React.FC = () => {
  const [schemaName, setSchemaName] = useState("");

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900 max-w-2xl">
      <h2 className="text-2xl font-bold tracking-tight">
        Register JSON-LD Credential Schema
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Publish immutable schemas straight to decentralized registries.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Schema Classification Name
          </label>
          <input
            type="text"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            placeholder="e.g., CorporateEmploymentCredential"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          Publish Schema Anchor
        </button>
      </div>
    </div>
  );
};
