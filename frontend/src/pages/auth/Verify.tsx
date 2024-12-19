
import React from 'react';
import { useState } from 'react';
import Email from './components/Email';
import Phone from './components/Phone';

export const Verify: React.FC = () => {
  const [mode, setMode] = useState(true);
  return (
    <div className='flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] h-[600px] backdrop-blur-lg '> 
      <h1 className="text-white text-4xl text-center font-semibold mb-8">Check your {mode ? "e-mail" : "messages"}</h1>
      {mode ? <Email/> : <Phone />} 
      <p className='text-[15px] text-black font-normal'>Didn&apos;t receive code? <a href="" className='text-white'>Resend code</a></p>
      <p className='my-4'>or</p>
      <a className ="text-[#F7DC64] text-[15px] cursor-pointer" onClick={()=> setMode(!mode)}>Try {mode ? "Phone number" : "E-mail"} instead</a>
      <button className="text-white w-[206px] h-[60px] font-semibold capitalize border border-solid rounded-[15px] border-black px-4 mt-2 bg-black" >&larr; Back to login</button>
    </div>
  )
}
