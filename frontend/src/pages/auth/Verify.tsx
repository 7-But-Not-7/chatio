
import React from 'react';
import { useState } from 'react';
export const Verify: React.FC = () => {
  const [mode, setMode] = useState(true);
  return (
    <div className='flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] h-[600px] backdrop-blur-lg '> 
      <h1 className="text-white text-4xl text-center font-semibold mb-8">Check your {mode ? "e-mail" : "messages"}</h1>
      {/* info text */}
      <h3 className="text-black font-semibold text-[15px] mb-4">
        {mode ? "We sent a verification link to xxxxx@gmail.com" : "We sent a verification link to xxxxxxxxxxx"}
      </h3>
      {/* form  */}
      <form
        className="flex flex-col items-center py-4 px-4"
      >
        <span className="flex flex-row ">
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] focus:ring-red-600"
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] focus:ring-red-200"
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] focus:ring-red-200"
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] focus:ring-red-200 "
            required
          />
        </span>
        <button className="bg-gradient-to-l from-[#2F6EB5] to-[#531FBB] text-white w-[153px] h-[60px] font-semibold capitalize rounded-[15px] px-4 mt-8  ">
          verify
        </button>
      </form>
      <p className='text-[15px] text-black font-normal'>Didn&apos;t receive code? <a href="" className='text-white'>Resend code</a></p>
      <p className='my-4'>--------- or --------- </p>
      <a className ="text-[#F7DC64] text-[15px] cursor-pointer" onClick={()=> setMode(!mode)}>Try {mode ? "Phone number" : "E-mail"} instead</a>
      <button className="text-white w-[206px] h-[60px] font-semibold capitalize border border-solid rounded-[15px] border-black px-4 mt-2 bg-black" >&larr; Back to login</button>
      
    </div>
  )
}
