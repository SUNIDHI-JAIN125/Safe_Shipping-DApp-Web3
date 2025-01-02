import React, {useState} from 'react';
import { useToast } from "@chakra-ui/react";
import { completeProject} from "../util/program/completeProject";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet"
import {useAnchorWallet } from "@solana/wallet-adapter-react" 
import { getClientProjects } from '../util/program/getclientprojects';  



export const CompleteProjectButton = ({setClientProjects,projectId,freelancerPubkey, agreedPrice}:{setClientProjects:any,projectId:number,freelancerPubkey:string,agreedPrice:number}) => {

  const toast = useToast(); 
  const wallet = useAnchorWallet();
 

  const handleCompleteSubmit = async () => {
    
    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required"
      })
      return
    }

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