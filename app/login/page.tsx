"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/useAuthContext";
import Cookies from "js-cookie";
import Notifiaction from "../components/notification";
import Link from "next/link";
import Notification from "../components/notification";

const Login = () => {
  const { user, setUser, setExistUser }: any = useUserContext();
  const [notification, setNotification] = useState({
    isShow: false,
    content: "",
    success: false,
  });
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

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
          setNotification({
            isShow: true,
            content: createAccount?.data?.data?.message || "Logged in",
            success: true,
          });
          const userId = createAccount.data.data.user.id;
          setUser(createAccount);
          setExistUser(true);
          Cookies.set("userId", createAccount.data.data.token, { expires: 7 });
          setTimeout(() => {
            route.push(`/dashboard/${userId}`);
          }, 4000);
        } else {
          setNotification({
            isShow: true,
            content: "something went wrongg",
            success: false,
          });
        }
      } catch (err) {
        setNotification({
          isShow: true,
          content: "Loggin Failed",
          success: false,
        });
        console.log("Error during login:", err);
      }
    },
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setNotification({
  //       isShow: false,
  //       content: "",
  //       success: true,
  //     });
  //   }, 10000);
  // }, [notification]);

  return (
    <div className="rounded flex items-center justify-center min-h-screen">
      {notification?.isShow && (
        <Notification
          isShow={notification.isShow}
          success={notification.success}
        >
          {notification.content}
        </Notification>
      )}
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
