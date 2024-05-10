import React, { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { assignProject } from "../util/program/assignProject";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { getClientProjects } from '../util/program/getclientprojects';  

const AssignProjectButton = ({setClientProjects,projectId}:{setClientProjects:any,projectId:number})=> {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [freelancerPubKey, setFreelancerPubKey] =  useState<string>('');
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const toast = useToast();
  const wallet = useAnchorWallet()

  const handleAssignClick = () => {
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleAssignSubmit = async () => {
    
    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required"
      })
      return
    }
    const { sig, error } = await assignProject(
      wallet as NodeWallet,
      projectId,
      freelancerPubKey,
      agreedPrice,
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
      <button onClick={handleAssignClick} className='inline-flex items-center justify-center px-4 py-2 border-2  border-white text-md font-light rounded-md text-pink-300  hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:border-none'>
        Assign Project
      </button>
      {showAssignModal && (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen p-4 text-center'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' aria-hidden='true' onClick={handleCloseAssignModal}></div>
            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <svg
                      className='h-6 w-6 text-green-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M12 6v6m0 4v2m-2-2h4m6-4v6m0 2a7.5 7.5 0 01-15 0v-2a7.5 7.5 0 1115 0z'
                      />
                    </svg>
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <h3 className='text-xl leading-6 font-semibold text-gray-900' id='modal-title'>
                      Assign Project
                    </h3>
                    <div className='mt-4'>
                      <label htmlFor='freelancerPubKey' className='text-lg font-medium p-2 text-gray-700'>
                        Freelancer PubKey
                      </label>
                      <input
                        type='text'
                        name='freelancerPubKey'
                        id='freelancerPubKey'
                        placeholder='Enter Freelancer PubKey'
                        className='mt-1 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-md border-2 border-gray-800'
                        value={freelancerPubKey}
                        onChange={(e) => setFreelancerPubKey(e.target.value)}
                        required
                      />
                    </div>
                    <div className='mt-4'>
                      <label htmlFor='agreedPrice' className='text-lg font-medium p-2 text-gray-700'>
                        Agreed Price
                      </label>
                      <input
                        type='number'
                        name='agreedPrice'
                        id='agreedPrice'
                        placeholder='Enter Agreed Price in SOL'
                        className='mt-1 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-md border-2 border-gray-800'
                        value={agreedPrice}
                        onChange={(e) => setAgreedPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className=' px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-4'>
                      <button
                        type='button'
                        onClick={handleAssignSubmit}
                        className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-md font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto'>
                        Assign
                      </button>
                      <button
                        type='button'
                        onClick={handleCloseAssignModal}
                        className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto '>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignProjectButton;
