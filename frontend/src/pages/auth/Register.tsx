import React from "react";
import * as yup from "yup";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isToastOpen, setIsToastOpen] = React.useState(false);

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

  // Handle submit function
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      console.log("Form submitted successfully:", formValues);
      setToastMessage("Registration successful!");
      setIsToastOpen(true);

      // Close the toast after 2 seconds
      setTimeout(() => {
        setIsToastOpen(false);
      }, 2000);
    } catch (err) {
      const newErrors: Partial<FormValues> = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            (newErrors as Record<string, string>)[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        // Extract the first error message
        const firstError = Object.values(errors).find((error) => typeof error === 'string') as string | undefined;
        setToastMessage(firstError || "An error occurred");
        setIsToastOpen(true);

        // Close the toast after 2 seconds
        setTimeout(() => {
          setIsToastOpen(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center shadow-lg rounded-[38px] border border-solid w-[599px] h-[600px] backdrop-blur-lg ">
      {/* Notification Toast */}
      <Alert
        variant="default"
        className={`absolute top-4 left-4 transition-opacity duration-300 ${
          isToastOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <AlertTitle>Notification</AlertTitle>
        <AlertDescription>{toastMessage}</AlertDescription>
      </Alert>

      <h1 className="text-2xl font-bold text-[43px] my-6 text-white ">
        Sign Up
      </h1>

      <form className="flex flex-col items-center py-4 px-4">
        <input
          type="text"
          placeholder="Full Name"
          className={`p-2 border ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          } rounded w-[433px] h-[41px] my-4 placeholder-grey-600 font-bold`}
          value={formValues.fullName}
          onChange={(e) =>
            setFormValues({ ...formValues, fullName: e.target.value })
          }
        />
        {errors.fullName && (
          <div className="text-red-500 text-sm">{errors.fullName}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className={`p-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded w-[433px] h-[41px] my-2 placeholder-grey-600 font-bold`}
          value={formValues.email}
          onChange={(e) =>
            setFormValues({ ...formValues, email: e.target.value })
          }
        />
        {/* {errors.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )} */}

        <input
          type="tel"
          placeholder="Phone Number"
          className="p-2 border border-gray-300 rounded w-[433px] h-[41px] my-2 placeholder-grey-600  font-bold"
          value={formValues.phoneNumber}
          onChange={(e) =>
            setFormValues({ ...formValues, phoneNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Username"
          className="p-2 border border-gray-300 rounded w-[433px] h-[41px] my-2 placeholder-grey-600  font-bold"
          value={formValues.username}
          onChange={(e) =>
            setFormValues({ ...formValues, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded w-[433px] h-[41px] my-2 placeholder-grey-600  font-bold"
          value={formValues.password}
          onChange={(e) =>
            setFormValues({ ...formValues, password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-2 border border-gray-300 rounded w-[433px] h-[41px] my-2 placeholder-grey-600  font-bold"
          value={formValues.confirmPassword}
          onChange={(e) =>
            setFormValues({ ...formValues, confirmPassword: e.target.value })
          }
        />
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            name="terms_and_condition"
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
          className="bg-gradient-to-l from-[#2F6EB5] to-[#531FBB] text-white p-2 w-[177.5px] h-[47px] my-2 rounded-[20px]"
        >
          Register
        </button>
      </form>

      <p className="text-white text-[15px]">
        Already have an account?{" "}
        <a href="#" className="text-white font-bold">
          Sign In
        </a>
      </p>
    </div>
  );
};
