import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminOnly from "@/components/admin-only";
import ClientProviders from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dawa Admin",
  description: "Medicines delivered under 30 minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientProviders>
          <AdminOnly>{children}</AdminOnly>
        </ClientProviders>
      </body>
    </html>
  );
}
