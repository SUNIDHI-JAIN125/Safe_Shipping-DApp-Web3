"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useToast, Spinner } from "@chakra-ui/react";

const WalletMultiButtonDynamic = dynamic(async () => (await
  import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
  loading: () => <Spinner size="md" />,
}) as any;

const ClientPage: React.FC = () => {
  const [client, setClient] = useState<string>('');
  const [transactionHashes, setTransactionHashes] = useState<{ walletAddress: string; hash: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const wallet = useAnchorWallet();
  const toast = useToast();

  useEffect(() => {
    const storedHashes = localStorage.getItem("transactionHashes");
    if (storedHashes) {
      setTransactionHashes(JSON.parse(storedHashes));
    }
  }, []); 

  useEffect(() => {
    if (wallet) {
      setTimeout(() => {
        window.location.href = '/create-project';
      }, 2500);
    }
  }, [wallet]);


 

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-100 gap-8">
      

         <h2 className="text-xl mt-3 "> 👋 Hey!! Nice to have you here...  😀 </h2>
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButtonDynamic />
      

      </div>
    <h2 className="text-3xl font-bold mb-4 items-center mx-auto mt-4">Please Connect Your Wallet To Proceed! 🚀 </h2>

      
    </main>
  )
}

export default ClientPage;
