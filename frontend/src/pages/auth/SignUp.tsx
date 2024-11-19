import { useSignUpStep } from "./hooks/useSignUpStep";

export const SignUp: React.FC = () => {
  const {currentStep, next, prev, reset} = useSignUpStep();

  return (
  <div>
    <h1>Sign up</h1>
    <p>Step: {currentStep}</p>
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
