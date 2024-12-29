"use client";
import React, { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { useToast } from "@chakra-ui/react";
import { createProject } from "../util/program/createProject";
import { getClientProjects } from '../util/program/getclientprojects';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import AssignProjectButton from './AssignProjectButton';
import { CompleteProjectButton } from './CompleteProjectButton';

const Page = () => {
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);  
  const [client, setClient] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<number>(0);
  const wallet = useAnchorWallet();
  const toast = useToast();

  useEffect(() => {
    if (!wallet) {
      setClientProjects([]);
      return;
    }
    const run = async () => {
      const data = await getClientProjects(wallet as NodeWallet);
      setClientProjects(data);
    };
    run();
  }, [wallet]);

  const handleCreateProjectClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      toast({
        status: "error",
        title: "Connect Wallet Required"
      });
      return;
    }

    const { sig, error } = await createProject(
      wallet as NodeWallet,
      client,
      description,
      budget
    );

    if (!sig || error) {
      toast({
        status: "error",
        title: error
      });
      return;
    }

    toast({
      status: "success",
      title: "Signature: " + sig
    });

    const data = await getClientProjects(wallet as NodeWallet);
    setClientProjects(data);
    setClient('');
    setDescription('');
    setBudget(0);

    // Close modal
    setShowModal(false);
  };

  return (
    <main className='bg-black min-h-screen '>
      <h1 className='text-green-300 text-4xl p-10 mb-10 justify-start'>Created Projects - </h1>
      {clientProjects.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-2xl">Nothing to show here...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 w-[70%] m-auto'>
          {clientProjects.map((project: Project) => (
            <div key={project.pubKey} className="bg-gray-800 rounded-md p-6 m-4 shadow-lg flex flex-col">
              <h2 className="text-lg font-semibold text-white">{project.client_name}</h2>
              <p className='text-white pl-1 mt-4'>Project Description -</p>
              <p className="text-green-300 mt-1 pl-1 tracking-wide whitespace-wrap">{project.description}</p>
              <p className="text-gray-300 mt-3 pl-1">Budget: <span className='text-green-300 pl-2'>{project.budget} SOL</span></p>
              <div className="flex justify-between mt-3">
                <p className="text-gray-300 mt-2 pl-1">State:</p>
                <span className={`text-green-300 mt-2 ${project.state === 2 ? 'text-yellow-400' : ''} ${project.state === 1 ? 'text-red-500' : ''} `}>
                  {project.state === 0 ? 'Open' : project.state === 1 ? 'Closed' : 'In Progress'}
                </span>
              </div>

              {(project.state === 1 || project.state === 2) && (
                <>
                  <p className="text-gray-300 mt-3 pl-1">
                    Freelancer Pubkey: {' '}
                    <span className="text-green-300  text-[0.80rem]">
                      {project.freelancer_pubkey}
                    </span>
                  </p>
                  <p className="text-gray-300 mt-3 pl-1">Agreed Price: <span className='text-green-300 pl-2'>{project.agreedPrice} SOL</span></p>
                </>
              )}

              {project.state === 0 && (
                <div className='flex justify-end mt-10'>
                  <AssignProjectButton setClientProjects={setClientProjects} projectId={project.id} />
                </div>
              )}

              {project.state === 2 && (
                <div className='flex justify-end'>
                  <CompleteProjectButton setClientProjects={setClientProjects} projectId={project.id} freelancerPubkey={project.pubKey} agreedPrice={project.agreedPrice} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className='flex items-center mt-4'>
        <button
          onClick={handleCreateProjectClick}
          type='submit'
          className='mx-auto tracking-wide mt-6 w-max-content inline-flex items-center justify-center px-4 py-2 border border-transparent text-xl font-light rounded-md text-black bg-green-400 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
          Add New Project +
        </button>
      </div>

      {/* Modal Code here... */}
      {showModal && (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen p-4 text-center'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' aria-hidden='true' onClick={handleCloseModal}></div>
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
                      New Project
                    </h3>

                    <form onSubmit={handleSubmit}>
                      <div className='mt-4'>
                        <label htmlFor='client' className='text-lg font-medium p-2 text-gray-700'>
                          Client Name
                        </label>
                        <input
                          type='text'
                          name='client'
                          id='client'
                          placeholder='Client Name'
                          className='mt-1 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-md border-2 border-gray-800'
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          required
                        />
                      </div>
                      <div className='mt-4'>
                        <div className='mt-2'>
                          <label htmlFor='description' className='text-lg font-medium p-2 text-gray-700'>
                            Project Description
                          </label>
                          <input
                            type='text'
                            name='description'
                            id='description'
                            placeholder='Describe Your Project'
                            className='mt-1 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-md border-2 border-gray-800'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                        <div className='mt-4'>
                          <label htmlFor='budget' className='text-lg font-medium p-2 text-gray-700'>
                            Budget
                          </label>
                          <input
                            type='number'
                            name='budget'
                            id='budget'
                            placeholder='Amount in SOL'
                            className='mt-1 p-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-md border-2 border-gray-800'
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className='flex justify-end mt-4'>
                        <button
                          type='submit'
                          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'>
                          Create Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
