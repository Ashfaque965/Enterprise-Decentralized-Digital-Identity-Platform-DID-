import React from "react";

export const NetworkTopology: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h2 className="text-2xl font-mono font-bold tracking-tight text-slate-100">
        Global Node Infrastructure Topology
      </h2>
      <p className="text-slate-400 text-xs mt-1">
        System orchestration plane over high-availability active validation
        shards.
      </p>

      <div className="mt-8 border border-slate-800 bg-slate-900 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-800/50 font-mono text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Validator Shard Node</th>
              <th className="p-4">Block Height</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            <tr>
              <td className="p-4 font-semibold text-slate-200">
                nexuscore-eu-validator-01
              </td>
              <td className="p-4">#41,892,019</td>
              <td className="p-4 text-emerald-400">● Operational</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
