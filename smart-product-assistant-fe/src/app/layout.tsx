import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/store/provider';
import SessionProvider from '@/components/providers/SessionProvider';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Product Assistant",
  description: "Your AI-powered shopping companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Providers>
          <SessionProvider>
            <main className="flex-1 pb-20">
              {children}
            </main>
            <MobileNav />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
