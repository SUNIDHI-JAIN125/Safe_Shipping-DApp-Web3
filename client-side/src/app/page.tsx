"use client";
import Link from "next/link";
export default function Home() {

  return (
    <>
      
      <div className="bg-cover bg-center bg-gray-200 h-screen relative flex gap-y-10  flex-col items-center justify-center">
        <div className="z-10 p-2 text-5xl text-center text-[#2e1968] font-semibold font-serif">
         <p className="tracking-wider 2xl:text-6xl"> WELCOME TO </p> 
         <h1 className=" tracking-wide p-4 px-10  mt-6 2xl:mt-10 bg-blue-200 text-blue-500 rounded-full">SAFE SHIPPING </h1>
        </div>

        <div className="flex flex-col items-center gap-7 mt-7">

          <h2 className="text-xl italic">Continue As -  </h2>
          <div className="flex gap-7">
          <Link href="/freelancer">  <button className="top-[8rem] w-[13rem]  transform-translate-y-1/2 z-10 px-6 py-2 bg-white shadow-xl border-2 border-b-4 border-gray-300 text-gray-600 rounded-xl text-xl font-bold font-mono hover:bg-gray-100  ">
        Freelancer
        </button></Link> 
        
        <Link href="/client"><button  className="top-[8rem] w-[13rem]  transform-translate-y-1/2 z-10 px-6 py-2 bg-white shadow-xl border-2 border-b-4 border-gray-300 text-gray-600 rounded-xl text-xl font-bold font-mono hover:bg-gray-100 ">
          Client 
        </button></Link> 
        </div>
        </div>

      </div>
    
    </>
  );
}
