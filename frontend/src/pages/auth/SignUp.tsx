import { useSignUpStep } from "./hooks/useSignUpStep";
import { Register } from "./Register";
import { Success } from "./Success";
import { Verify } from "./Verify";

export const SignUp: React.FC = () => {
  const {currentStep, next, prev, reset} = useSignUpStep();
  return (
  <div className="flex items-center h-screen w-full justify-center  ">
    {currentStep === "register" && <Register />}
    {currentStep === "email-phone" && <Verify />}
    {currentStep === "success" && <Success />}
    <div className="flex flex-row gap-4 items-center justify-center p-5">
      <button onClick={next}>Next</button>
    </div>
    <div>
      <button onClick={prev}>Prev</button>
    </div>
    <div>
      <button onClick={reset}>Reset</button>
    </div>
  </div>
);
};
