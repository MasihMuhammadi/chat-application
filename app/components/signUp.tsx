"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "./notification";
import Mockup from "./mockup";

const SignUp = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

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
  const [notification, setNotification] = useState({
    isShow: false,
    content: "",
    success: false,
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
        setNotification({
          isShow: true,
          content: response.data.message || "User created successfully",
          success: true,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        setNotification({
          isShow: true,
          content: err.response?.data?.error || "Failed to create account",
          success: false,
        });
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  overflow-hidden">
      <Notification isShow={notification.isShow} success={notification.success}>
        {notification.content}
      </Notification>
      <div className="flex flex-col md:flex-row-reverse  h-auto items-center justify-around  w-full ">
        <div className="mockup hidden lg:block -mt-20">
          <Mockup />
        </div>
        <div className="bg-white p-8  rounded-md w-full max-w-sm shadow-xl shadow-[#04143A]">
          <h1 className="text-4xl font-semibold  mb-6">Register First</h1>
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
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
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
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="bg-[#04143A] text-white px-4 py-2 rounded w-full"
            >
              Register
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
    </div>
  );
};

export default SignUp;
