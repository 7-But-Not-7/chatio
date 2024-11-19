import { useSignUpStep } from "./hooks/useSignUpStep";
import { Register } from "./Register";
import { Success } from "./Success";
import { Verify } from "./Verify";

export const SignUp: React.FC = () => {
  const {currentStep, next, prev, reset} = useSignUpStep();
  return (
  <div>
    <h1>Sign up</h1>
    {currentStep === "register" && <Register />}
    {currentStep === "email-phone" && <Verify />}
    {currentStep === "success" && <Success />}

    <div>
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
