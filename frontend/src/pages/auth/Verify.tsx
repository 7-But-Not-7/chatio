
import React from 'react';
import { useRef, useState } from 'react';
import { useSignUpStep } from './hooks/useSignUpStep';

export const Verify: React.FC = () => {
  const [mode, setMode] = useState(true);
  const { prev, next } = useSignUpStep();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [pinValues, setPinValues] = useState<string[] | number[]>([]);

  // handle change function to move the cursor to the next input
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    pinValues[index] = value
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    console.log(pinValues)
    
  };
  //  handle key down function -- controls what happens if you press backspace 
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

  // handle submit function
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    console.log("form submitted successfully ", pinValues)
    next();

  }
  
  return (
    <div className='flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] h-[600px] bg-[#ffffff4d] '> 
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
        {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] text-center text-lg focus:ring-red-200"
              maxLength={1}
              required
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </span>
        <button 
        onClick={handleSubmit}
        className="bg-gradient-to-l from-[#2F6EB5] to-[#531FBB] text-white w-[153px] h-[60px] font-semibold capitalize rounded-[15px] px-4 mt-8  ">
          verify
        </button>
      </form>
      <p className='text-[15px] text-black font-normal'>Didn&apos;t receive code? <a href="" className='text-white'>Resend code</a></p>
      <p className='my-4'>--------- or --------- </p>
      <a className ="text-[#F7DC64] text-[15px] cursor-pointer" onClick={()=> setMode(!mode)}>Try {mode ? "Phone text" : "E-mail"} instead</a>
      <button onClick={prev} className="text-white w-[206px] h-[60px] font-semibold capitalize border border-solid rounded-[15px] border-black px-4 mt-2 bg-black" >&larr; Back to Signup</button>
      
    </div>
  )
}
// function useRef<T>(arg0: never[]) {
//   throw new Error('Function not implemented.');
// }

