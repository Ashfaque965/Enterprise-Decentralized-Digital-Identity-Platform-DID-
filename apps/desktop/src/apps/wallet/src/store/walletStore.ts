import { createStore } from "zustand/vanilla";

interface WalletState {
  masterAddress: string | null;
  activeDids: string[];
  isDeviceLocked: boolean;
  initializeSecureSession: (address: string) => void;
  registerNewDid: (did: string) => void;
  terminateSession: () => void;
}

export const secureWalletStore = createStore<WalletState>((set) => ({
  masterAddress: null,
  activeDids: [],
  isDeviceLocked: true,

  initializeSecureSession: (address: string) =>
    set({
      masterAddress: address,
      isDeviceLocked: false,
    }),

  registerNewDid: (did: string) =>
    set((state) => ({
      activeDids: [...state.activeDids, did],
    })),

  terminateSession: () =>
    set({
      masterAddress: null,
      activeDids: [],
      isDeviceLocked: true,
    }),
}));
