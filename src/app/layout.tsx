import Navbar from "@/components/Navbar";
import { getAuthSession } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
