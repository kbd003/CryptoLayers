import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoLayers - Criptografia em Camadas",
  description: "Sistema de criptografia e descriptografia multicamadas com geração de código mestre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
