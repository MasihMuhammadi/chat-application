"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/useAuthContext";
import Cookies from "js-cookie";
import Link from "next/link";

const Login = () => {
  // Validation schema using Yup
  const { user, setUser, setExistUser }: any = useUserContext();
  const baseUrl = "https://chat-backend-qvhb.onrender.com";
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const route = useRouter();
  // useFormik hook
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const createAccount = await axios.post(
          `${baseUrl}/api/auth/login`,
          values
        );

        if (createAccount.data.success) {
          const userId = createAccount.data.data.user.id;
          setUser(createAccount);
          setExistUser(true);
          // Store user ID in a cookie
          Cookies.set("userId", userId, { expires: 7 }); // Cookie will expire in 7 days

          // Redirect to a nested route with the user ID
          route.push(`/dashboard/${userId}`);
        } else {
          console.log("User does not exist");
        }
      } catch (err) {
        console.log("Error during login:", err);
      }
    },
  });

  return (
    <div className="rounded flex items-center justify-center min-h-screen">
      <form
        className="flex flex-col w-fit gap-5 bg-slate-200 rounded p-16"
        onSubmit={formik.handleSubmit}
      >
        <p className="font-bold text-2xl">Login</p>
        <div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border-2 p-2 border-black rounded h-8 w-64"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-2 p-2 border-black rounded h-8 w-64"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
        <p>
          You haven't account?{" "}
          <Link className="text-blue-500 underline" href={"/"}>
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
