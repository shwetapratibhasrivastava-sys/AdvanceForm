import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Validation Schema
const schema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Only alphabets allowed")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number")//9+1
    .required("Phone is required"),

  password: yup
    .string()
    .min(6, "Min 6 characters")
    .matches(/[A-Z]/, "One uppercase required")
    .matches(/[0-9]/, "One number required")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")//oneOf function which is used for comparison n take reference from password
    .required("Confirm password is required"),
});

// ✅ Dummy API (POST) //asyn is a function n formData is initial parameter
const postFormData = async (formData) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST", //CRUD-C-POST R-GET U-PUT D-DELETE + PATCH( UPDATE PARTICULAR FIELD )+ OPTIONS
    body: JSON.stringify(formData), //json ke through string me convert kar do
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!res.ok) throw new Error("Failed to submit");  //if response is not okk throw error failed to submit

  return res.json(); //print form data 
};

function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {  
    register,   
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ React Query Mutation
  const mutation = useMutation({    
    mutationFn: postFormData,

    onSuccess: (data) => {
      console.log("API Response:", data);
      toast.success("Form submitted successfully 🚀"); //popup
      reset(); //to reset form
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");  //show where the error is else show something went wrong
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data); 
  };

  const onError = () => {
    toast.error("Please fix form errors");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit, onError)} //show data if successful else through error
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>

        {/* Name */}
        <div>
          <input
            {...register("name")} 
            placeholder="Full Name"
            className="w-full border p-2 rounded-lg"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "")) 
            }
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p> {/*optional chaining*/}
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Phone */}
        <div>
          <input
            {...register("phone")}
            placeholder="Mobile Number"
            maxLength={10}
            className="w-full border p-2 rounded-lg"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
          <p className="text-red-500 text-sm">{errors.phone?.message}</p>
        </div>
       {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="w-full border p-2 pr-10 rounded-lg"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full border p-2 pr-10 rounded-lg"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}  
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {mutation.isPending ? "Submitting..." : "Submit"}   {/* showing the state */}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2000} /> 
    </div>
  );
}

export default Form;