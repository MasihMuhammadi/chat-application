"use client";
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

// Create the UserContext
const UserContext: any = createContext("");

// Create the UserProvider component
export const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [existUser, setExistUser] = useState<boolean>(false);
  return (
    <UserContext.Provider value={{ user, setUser, existUser, setExistUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);
