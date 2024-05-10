import React, {useState} from 'react';
import { useToast } from "@chakra-ui/react";
import { completeProject} from "../util/program/completeProject";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet"
import {useAnchorWallet } from "@solana/wallet-adapter-react" 
import { getClientProjects } from '../util/program/getclientprojects';  

// import {
//   LAMPORTS_PER_SOL,
//   SystemProgram,
//   Transaction,
//   sendAndConfirmTransaction,
//   Keypair,
//   PublicKey,
//   Connection
// } from "@solana/web3.js";
// import { web3 } from '@project-serum/anchor';


export const CompleteProjectButton = ({setClientProjects,projectId,freelancerPubkey, agreedPrice}:{setClientProjects:any,projectId:number,freelancerPubkey:string,agreedPrice:number}) => {

  const toast = useToast(); 
  const wallet = useAnchorWallet();
  // const connection = new Connection(web3.clusterApiUrl("devnet"),'confirmed' );

  const handleCompleteSubmit = async () => {
    
    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required"
      })
      return
    }


    // const secretKey=  Uint8Array.from([])
    
    // const signer = Keypair.fromSecretKey(secretKey);
    // const publicKey =  new PublicKey(freelancerPubkey);
   



  
    // const transferInstruction = SystemProgram.transfer({
    //   fromPubkey: wallet.publicKey,
    //   toPubkey: publicKey,
    //   lamports: agreedPrice * LAMPORTS_PER_SOL, // Convert transferAmount to lamports
    // });




    // Add the transfer instruction to a new transaction
// const transaction = new Transaction().add(transferInstruction);

// Send the transaction to the network
// const transactionSignature = await sendAndConfirmTransaction(
//   connection,
//   transaction,
//   [signer] // signer
// );

    // console.log(
    //   "Transaction Signature:",
    //   `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    // );

    const { sig, error } = await completeProject(
      wallet as NodeWallet,
      projectId,
    )

    if (!sig || error) {
      toast({
        status: "error",
        title: error
      })
      return
    }
    console.log(sig)
    const data = await getClientProjects(wallet as NodeWallet)
    setClientProjects(data)
    toast({
      status: "success",
      title: "Signature: " + sig
    })
  };
  return (
<>
<button onClick={handleCompleteSubmit} className='inline-flex items-center justify-center px-4 py-2 border-2  border-white text-md font-light rounded-md text-pink-300  hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:border-none'>
        Complete Project
      </button>
    </>
  )
}