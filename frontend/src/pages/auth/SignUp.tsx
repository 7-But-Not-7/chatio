import { useSignUpStep } from "./hooks/useSignUpStep";
import { Register } from "./Register";
import { Success } from "./Success";
import { Verify } from "./Verify";

export const SignUp: React.FC = () => {
  const {currentStep, next, prev, reset} = useSignUpStep();
  return (
  <div className="flex w-full relative">
    {currentStep === "register" && <Register />}
    {currentStep === "email-phone" && <Verify />}
    {currentStep === "success" && <Success />}

    <div className="absolute top-0">
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
