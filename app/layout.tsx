import "@/app/globals.css"; // Ensure standard Tailwind directives are loaded here
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexusCore Web3 Identity Hub",
  description:
    "Next Generation Sovereign Self-Custodian Identification Portal Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
