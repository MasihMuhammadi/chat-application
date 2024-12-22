"use formik";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const baseUrl = "https://chat-backend-1096.onrender.com";

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    userName: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${baseUrl}/api/auth/register`, {
          email: values.email,
          username: values.userName,

          password: values.password,
        });
        console.log(response.data.message || "User created successfully");
        router.push("/login");
      } catch (err: any) {
        console.log(err.response?.data?.error || "Failed to create account");
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="border-2 border-gray-300 rounded w-full h-10 px-3"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              className="border-2 border-gray-300 rounded w-full h-10 px-3"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.userName}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-2 border-gray-300 rounded w-full h-10 px-3"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="border-2 border-gray-300 rounded w-full h-10 px-3"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
