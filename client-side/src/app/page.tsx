"use client";
import Link from "next/link";
export default function Home() {

  return (
    <>
      
      <div className="bg-cover bg-center bg-black h-screen relative flex gap-y-2  flex-col items-center justify-center">
        <div className="z-10 text-6xl text-center text-white font-bold font-sans">
         <p className=" 2xl:text-7xl tracking-tight word-spacing-2"> Decentralized Freelancing App</p> 
         <h1 className="px-10 mt-2 2xl:mt-4  text-green-300 rounded-full">SAFE SHIPPING </h1>
        </div>

<h2 className="text-green-100 text-2xl mt-10" >Your chance to shape what's next. Join the community now!</h2>
        <div className="flex flex-col items-center gap-7 mt-2">


          <h2 className="text-xl text-gray-400 italic">Continue As -  </h2>
          <div className="flex gap-7 mt-4">
          <Link href="/freelancer">  <button className="top-[8rem] w-[13rem]  transform-translate-y-1/2 z-10 px-6 py-2 bg-green-400 shadow-xl border-2 border-b-4 font-semibold border-black rounded-xl text-xl  font-mono hover:bg-green-500  text-black ">
        Freelancer
        </button></Link> 
        
        <Link href="/client"><button  className="top-[8rem] w-[13rem]  transform-translate-y-1/2 z-10 px-6 py-2 bg-transparent shadow-xl border font-semibold border-green-700 text-white rounded-xl text-xl font-mono hover:text-green-400 ">
          Client
        </button></Link> 
        </div>
        </div>

      </div>
    
    </>
  );
}
