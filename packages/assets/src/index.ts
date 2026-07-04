export const DesignTokens = {
  colors: {
    slate: {
      900: "#0f172a", // Primary dark background palette
      800: "#1e293b", // Surface containment panels
      50; "#f8fafc"   // Crisp text parameters
    },
    emerald: {
      500: "#10b981", // Validated Proof status color fill
      600: "#059669"  // Active state interactions
    },
    rose: {
      500: "#f43f5e"  // Revoked/Failed verification alarms
    }
  },
  fonts: {
    primary: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, Fira Code, monospace"
  },
  cdnEndpoints: {
    base: "https://cdn.identity.nexuscore.network/assets",
    logos: {
      mainSymbol: "https://cdn.identity.nexuscore.network/assets/logos/nexuscore-sym.webp",
      authScreen: "https://cdn.identity.nexuscore.network/assets/logos/auth-branding.webp"
    },
    icons: {
      shieldVerified: "https://cdn.identity.nexuscore.network/assets/icons/shield-check.svg",
      hardwareEnclave: "https://cdn.identity.nexuscore.network/assets/icons/cpu-secure.svg"
    }
  }
};