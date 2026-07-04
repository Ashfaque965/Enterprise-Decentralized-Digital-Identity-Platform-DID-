"use client";

import React from "react";

interface WalletButtonProps {
  account: string | null;
  onConnect: () => void;
  isLoading: boolean;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  account,
  onConnect,
  isLoading,
}) => {
  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className={`px-5 py-2.5 rounded-xl font-mono text-sm tracking-wide transition-all duration-200 border ${
        account
          ? "bg-slate-900 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10"
          : "bg-emerald-600 hover:bg-emerald-500 border-transparent text-slate-900 font-bold hover:shadow-md hover:shadow-emerald-500/20"
      } disabled:opacity-50`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : account ? (
        `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
      ) : (
        "Connect Sovereign Wallet"
      )}
    </button>
  );
};
