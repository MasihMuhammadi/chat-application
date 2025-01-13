"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const CheckParams = async (paramId: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

  try {
    const checkId = await axios.get(`${baseUrl}/api/user/get`, {
      headers: { Authorization: `Bearer ${Cookies.get("userId")}` },
      withCredentials: true,
    });

    const loggedInUserId = checkId.data.data._id;

    if (loggedInUserId !== paramId) {
      redirect(`/dashboard/${loggedInUserId}`);
    }

    return loggedInUserId;
  } catch (err) {
    console.log("Error fetching user data or redirecting:", err);
    redirect("/login");
  }
};

export default CheckParams;
