import React from "react";
import * as yup from "yup";
import { Input } from "./components/Input";
import { useSignUpStep } from "./hooks/useSignUpStep";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoDuotone } from "react-icons/pi";

export const Register: React.FC = () => {
  type FormValues = {
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    confirmPassword: string;
    checked: boolean;
  };
  // move to the next step
  const { next } = useSignUpStep();
  // Set states to store user input
  const [formValues, setFormValues] = React.useState<FormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    checked: false,
  });

  const [errors, setErrors] = React.useState<Partial<FormValues>>({});

  // Validation schema
  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .matches(/(?=.*[a-zA-z])/, "Full Name is invalid")
      .required("Full Name is required"),
    email: yup
      .string()
      .email("Invalid Email format")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^\d{11}$/, "Phone number is not complete")
      .required("Phone Number is required"),
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/(?=.*[0-9])/, "Password must contain a number")
      .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
      .matches(/(?=.*[a-z])/, "Password must contain a lowercase letter")
      .matches(/(?=.*[!@#$%^&*])/, "Password must contain a special character"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Passwords must match"),
    checked: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and conditions"),
  });
  // on blur function to validate the input in focus
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
  
  // on change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  // Handle submit function
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      console.log("Form submitted successfully:", formValues);
      next();
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
        setErrors(firstError ? { [err.path as string]: firstError } : newErrors);
        
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] my-2 h-fit  bg-[#ffffff4d]">
      

      <h1 className=" font-bold text-[43px] mt-3 mb-1 text-white ">
        Sign Up
      </h1>

      <form className="flex flex-col items-center py-4 px-4">
        <Input
          type="text"
          placeholder="Full Name"
          formValue={formValues.fullName}
          handleChange={handleChange}
          name="fullName"
          errors={errors.fullName}
          handleBlur={handleBlur}
        />

        <Input
          type="email"
          placeholder="Email"
          formValue={formValues.email}
          handleChange={handleChange}
          name="email"
          errors={errors.email}
          handleBlur={handleBlur}
          />

        <Input
          type="tel"
          placeholder="Phone Number"
          formValue={formValues.phoneNumber}
          handleChange={handleChange}
          name="phoneNumber"
          errors={errors.phoneNumber}
          handleBlur={handleBlur}
        />
        <Input 
        type = "text"
        placeholder="Username"
        formValue={formValues.username}
        handleChange={handleChange}
        name="username"
        errors={errors.username}
        handleBlur={handleBlur}
        />
        <Input
        type = "password"
        placeholder="Password"
        formValue={formValues.password}
        handleChange={handleChange}
        name="password"
        errors={errors.password}
        handleBlur={handleBlur}
        />
        <Input
        type = "password"
        placeholder="Confirm Password"
        formValue={formValues.confirmPassword}
        handleChange={handleChange}
        name="confirmPassword"
        errors={errors.confirmPassword}
        handleBlur={handleBlur}
        />

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
          <p className="text-[16px]">
        I agree to the{" "}
        <a href="#" className="text-white font-bold">
          terms and conditions
        </a>
          </p>
        </span>

        <button
          onClick={handleSubmit}
          className="font-semibold bg-gradient-to-l from-[#2F6EB5] to-[#531FBB] text-white p-2 w-[177.5px] h-[47px] my-2 rounded-[20px]"
        >
          Sign Up
        </button>
      </form>
        <p className="font-bold">Sign Up with</p>
        <span className="grid md:grid-cols-2 gap-2">
                  <button className="bg-black text-white p-2 w-fit flex items-center h-[47px] my-2 rounded-[20px]"><FcGoogle /><p className="ml-2">Sign up with Google </p></button>
                  <button className="bg-black text-white p-2 w-[177.5px] flex items-center h-[47px] my-2 rounded-[20px]"><PiAppleLogoDuotone /> <p className="ml-2">Sign up with Apple</p> </button>
                </span>
      <p className="text-black mb-6 font-semibold text-[15px]">
        Have an account?{" "}
        <a href="/auth/login" className="text-white font-bold">
          Sign In
        </a>
      </p>
    </div>
  );
};
