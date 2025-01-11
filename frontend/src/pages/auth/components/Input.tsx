// import { ValidationError } from "yup";

interface InputProps {
    type: string;
    placeholder: string;
    errors : string | undefined;
    name: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formValue: string;
}

export const Input: React.FC<InputProps> = ({ type, placeholder,name,  errors,  formValue, handleChange }) => {
    return ( 
        <>
            <input
              type={type}
              placeholder={placeholder}
                name={name}
              className={`p-2 border ${
                errors ? "border-red-500" : "border-gray-300"
              } rounded w-[433px] h-[41px] mt-4 placeholder-grey-600 font-bold`}
              value={formValue}
              onChange={handleChange}
            />
            {errors && (
              <div className="text-red-500 text-sm">{errors}</div>
            )}
        </>
     );
}