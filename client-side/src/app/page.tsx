"use client";
import Link from "next/link";
import { FaGithub, FaHandsHelping, FaBriefcase, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="bg-cover bg-center bg-black h-[90vh] relative flex gap-y-2 flex-col items-center justify-center">
      
        <div className="absolute top-5 right-16 flex items-center gap-2 text-gray-300">
          <FaGithub size={20} />
          <Link
            href="https://github.com/SUNIDHI-JAIN125/Safe_Shipping-DApp-Web3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hover:underline">GitHub</span>
          </Link>
        </div>

       
        <div className="z-10 text-4xl xl:text-6xl text-center text-white font-bold font-sans">
          <p className="text-4xl xl:text-7xl tracking-tight word-spacing-2">
            Decentralized Freelancing App
          </p>
          <h1 className="px-10 mt-2 2xl:mt-4 text-green-300 rounded-full">
            SAFE SHIPPING
          </h1>
        </div>

        <h2 className="text-green-100 text-xl lg:text-2xl mt-10 p-2 lg:p-0 text-center">
          Your chance to shape what's next. Join the community now!
        </h2>
        <div className="flex flex-col items-center gap-7 mt-2">
          <h2 className="text-xl text-gray-400 italic">Continue As -</h2>
          <div className="flex flex-col md:flex-row gap-7 mt-4">
            <Link href="/freelancer">
              <button className="top-[8rem] w-[13rem] transform-translate-y-1/2 z-10 px-6 py-2 bg-green-400 shadow-xl border-2 border-b-4 font-semibold border-black rounded-xl text-xl font-mono hover:bg-green-500 text-black">
                Freelancer
              </button>
            </Link>

            <Link href="/client">
              <button className="top-[8rem] w-[13rem] transform-translate-y-1/2 z-10 px-6 py-2 bg-transparent shadow-xl border font-semibold border-green-700 text-white rounded-xl text-xl font-mono hover:text-green-400">
                Client
              </button>
            </Link>
          </div>
        </div>
      </div>

    
      <div className="bg-black py-16">
        <div className="container mx-auto px-5 mb-10 flex flex-col lg:flex-row gap-10 justify-start items-start">
       
          <div className="bg-transparent border  border-green-900 shadow-lg rounded-lg p-6 xl:p-10 items-start justify-start text-start w-full lg:w-1/3 hover:border-green-700">
          <div className="flex items-start mb-4">
        <FaHandsHelping size={50} className="text-green-400 rounded-lg p-2 bg-green-900" />
      </div>
            <h3 className="text-xl text-gray-200 font-bold mb-2 mt-6">Collaborate Effortlessly</h3>
            <p className="text-green-100  mt-4 tracking-wide text-lg">
              Build meaningful connections with clients and freelancers on a decentralized platform.
            </p>
          </div>

         
          <div className="bg-transparent border  border-green-900 shadow-lg rounded-lg p-6 xl:p-10 items-start justify-start text-start w-full lg:w-1/3 hover:border-green-700">
          <div className="flex items-start mb-4">
            <FaBriefcase size={50} className="text-green-400 p-2 rounded-lg bg-green-900" />
            </div>
            <h3 className="text-xl text-gray-200 font-bold mb-2 mt-6">Streamlined Workflow</h3>
            <p className="text-green-100  mt-4 tracking-wide text-lg">
              Manage projects and transactions securely without third-party interference.
            </p>
          </div>

       
          <div className="bg-transparent border  border-green-900 shadow-lg rounded-lg p-6 xl:p-10 items-start justify-start text-start w-full lg:w-1/3 hover:border-green-700">
          <div className="flex items-start mb-4">
            <FaShieldAlt size={50} className="text-green-400 p-2 rounded-lg bg-green-900" />
            </div>
            <h3 className="text-xl text-gray-200 font-bold mb-2 mt-6">Enhanced Security</h3>
            <p className="text-green-100  mt-4 tracking-wide text-lg">
              Protect your data and payments with blockchain-powered transparency.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
