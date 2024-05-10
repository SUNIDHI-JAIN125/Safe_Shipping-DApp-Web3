import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react"
import Wallet from "./contexts/walletContext";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'SAFE SHIPPING',
  description: 'Dapp for Freelancing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ChakraProvider cssVarsRoot="body">
        <Wallet>
        {children}
        </Wallet>
        </ChakraProvider>
        </body>

    </html>
  )
}


