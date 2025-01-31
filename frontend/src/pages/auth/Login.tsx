import { useDeviceDetails } from "@/hooks/useDevice";
import React, { useEffect } from "react";
import { Input } from "./components/Input";
import * as yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoDuotone } from "react-icons/pi";


export const Login: React.FC = () => {
  const device = useDeviceDetails();
  type FormValues = {
    username: string;
    password: string;
    checked:boolean;
  };
  const [formValues, setFormValues] = React.useState<FormValues>({
    username: "",
    password: "",
    checked:false
  });
  const [errors, setErrors] = React.useState<Partial<FormValues>>({});

  // Validation schema
  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/(?=.*[0-9])/, "Password must contain a number")
      .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
      .matches(/(?=.*[a-z])/, "Password must contain a lowercase letter")
      .matches(/(?=.*[!@#$%^&*])/, "Password must contain a special character"),
  });
  //check device id
  useEffect(() => {
    console.log(device);
  }, [device]);
  //handleBlur function
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    try {
      // Validate only the field being blurred
      await validationSchema.validateAt(name, { ...formValues, [name]: value });
      // Clear the error if validation passes
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Update error state with the validation error for the current field
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
      }
    }
  };
  //handleChange funciton
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  }; // Handle submit function
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      console.log("Form submitted successfully:", formValues);
    } catch (err) {
      const newErrors: Partial<FormValues> = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            (newErrors as Record<string, string>)[error.path] = error.message;
          }
        });
        // Extract the first error message
        const firstError = Object.values(errors).find(
          (error) => typeof error === "string"
        ) as string | undefined;
        setErrors(
          firstError ? { [err.path as string]: firstError } : newErrors
        );
      }
    }
  };
  return (
    <div className="flex items-center h-screen w-full justify-center">
      <div className="flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] my-2 h-[600px]  bg-[#ffffff4d]">
        <h1 className=" font-bold text-[43px] mt-3 mb-1 text-white ">
          Sign In
        </h1>
        <form className="flex flex-col items-center py-4 px-4">
          <Input
            type="text"
            placeholder="Username"
            formValue={formValues.username}
            handleChange={handleChange}
            name="username"
            errors={errors.username}
            handleBlur={handleBlur}
          />
          <Input
            type="password"
            placeholder="Password"
            formValue={formValues.password}
            handleChange={handleChange}
            name="password"
            errors={errors.password}
            handleBlur={handleBlur}
          />
        <div className="flex items-center justify-between w-[433px]">
          <span className="flex items-center gap-2">
          <input
        type="checkbox"
        name="checked"
        className="bg-transparent border-2 border-solid border-black focus:ring-0 text-black"
        checked={formValues.checked}
        onChange={(e) =>
          setFormValues({ ...formValues, checked: e.target.checked })
        }
          />{" "}
          <p className="text-[16px] font-semibold text-[#F7DC64]">
       Remember me
          </p>

        </span>
        <p className="text-[15px] text-[#fff] font-semibold">Forgot Password?</p>

        </div>
          <button
          onClick={handleSubmit}
          className="mt-8  font-semibold bg-gradient-to-l from-[#2F6EB5] to-[#531FBB] text-white p-2 w-[177.5px] h-[47px] my-2 rounded-[6px]"
        >
          Sign Up
        </button>
        </form>
        <p className="font-bold">Sign In with</p>
        <span className="grid md:grid-cols-2 gap-2">
          <button className="bg-black text-white p-2 w-fit flex items-center h-[47px] my-2 rounded-[20px]"><FcGoogle /><p className="ml-2">Sign In with Google </p></button>
          <button className="bg-black text-white p-2 w-[177.5px] flex items-center h-[47px] my-2 rounded-[20px]"><PiAppleLogoDuotone /> <p className="ml-2">Sign In with Apple</p> </button>
        </span>

        <p className="text-black my-6 font-semibold text-[15px]">
        New to Chat.io?{" "}
        <a href="/auth/sign-up" className="text-white font-bold">
          Sign Up
        </a>
      </p>
      </div>
    </div>
  );
};
