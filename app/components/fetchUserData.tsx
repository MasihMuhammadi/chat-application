"use client";

import { useEffect } from "react";
import { useUserContext } from "../context/useAuthContext";
import axios from "axios";
import Cookies from "js-cookie"; // Install using `npm install js-cookie`

const FetchUserData: React.FC = () => {
  const { setUser, user, setExistUser, existUser }: any = useUserContext();

  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("userId");
        const response = await axios.get(`${baseUrl}/api/user/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const userData = response.data;
          setUser(userData);
          setExistUser(true);
        }
      } catch (error) {
        console.log("Error fetching user data in FetchUserData:", error);
      }
    };

    fetchData();
  }, [setUser]);

  return null; // This component doesn't render anything
};

export default FetchUserData;
