"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { initialiseFreelancer } from "../util/program/initialiseFreelancer";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useToast, Spinner } from "@chakra-ui/react";

const WalletMultiButtonDynamic = dynamic(async () => (await
  import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
  loading: () => <Spinner size="md" />,
}) as any;

const FreelancerPage: React.FC = () => {
  const [freelancer, setFreelancer] = useState<string>('');
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancer.trim()) {
      toast({
        status: "error",
        title: "Please fill the form!!"
      });
      return;
    }

    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required"
      });
      return;
    }

    setIsLoading(true);

    const { publicKey } = wallet;
    const walletAddress = publicKey?.toBase58() || '';

    const { sig, error } = await initialiseFreelancer(
      wallet as NodeWallet,
      freelancer
    );

    setIsLoading(false);

    if (!sig || error) {
      toast({
        status: "error",
        title: error
      });
      return;
    }

    console.log("Add sig: ", sig);

   
    const updatedHashes = [...transactionHashes, { walletAddress, hash: sig }];
    setTransactionHashes(updatedHashes);

 
    localStorage.setItem("transactionHashes", JSON.stringify(updatedHashes));

    toast({
      status: "success",
      title: "Signature: " + sig
    });

    setFreelancer('');

    
    setTimeout(() => {
 
      window.location.href = '/create-project';
    }, 3000); 
  };

  const filteredTransactionHashes = transactionHashes.filter(hash => hash.walletAddress === wallet?.publicKey?.toBase58());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-100 gap-8">
      <div className="border hover:border-slate-900 rounded">
        <WalletMultiButtonDynamic />
      </div>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Freelancer Initialization Form</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4 pt-3">
            <label htmlFor="freelancerName" className="block text-xl font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="freelancerName"
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
              className="mt-2 mb-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-xl border-gray-300 rounded-md p-4"
            />
          </div>

          <button type="submit" className="tracking-wide mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-xl font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {isLoading ? <Spinner size="sm" /> : "Initialize Freelancer"}
          </button>
        </form>
      </div>
      {filteredTransactionHashes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Past Transaction Hashes:</h3>
          <ul>
            {filteredTransactionHashes.map((hash, index) => (
              <li key={index}>{hash.hash}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}

export default FreelancerPage;

         