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
import Mockup from "../components/mockup";

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
      <div className="flex flex-col md:flex-row-reverse h-auto items-center justify-around  w-full ">
        <div className="mockup hidden lg:block -mt-20">
          <Mockup />
        </div>
        <div className="bg-white p-8  rounded-md w-full max-w-sm py-24 shadow-xl shadow-[#04143A]">
          <form onSubmit={formik.handleSubmit}>
            <h1 className="text-4xl font-semibold mb-10">Login Now</h1>

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
            <button
              type="submit"
              className="bg-[#04143A] text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
            <p className="mt-4 text-center">
              You haven't account?{" "}
              <Link className="text-blue-500 underline" href={"/"}>
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
