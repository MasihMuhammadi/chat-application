"use client";
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

// Create the UserContext
const UserContext: any = createContext("");

// Create the UserProvider component
export const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [existUser, setExistUser] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;
  useEffect(() => {
    const getUserById = async () => {
      const userCookie = Cookies.get("userId");

      if (userCookie) {
        try {
          const userId = Cookies.get("userId"); // Extract the userId from cookies
          if (!userId) throw new Error("User ID not found in cookies");

          // Send the userId as a route parameter
          const response = await axios.get(`${baseUrl}/api/user/get`, {
            headers: { Authorization: `Bearer ${userId}` },
            withCredentials: true,
          });
        } catch (error: any) {
          console.log("Error fetching user details:", error.message);
        }
      }
    };
    getUserById();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, existUser, setExistUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
