"use client";
import Link from "next/link";
import { useUserContext } from "../context/useAuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  //   const [existUser, setExistUser] = useState(false); // Local state to store cookie value
  // const {existUser,setExistUser} = useUserContext()
  const router = useRouter();
  const { user, setUser, existUser, setExistUser }: any = useUserContext();

  // Read the cookie value on the client side
  useEffect(() => {
    const userId = Cookies.get("userId");
    setExistUser(!!userId); // Set to true if userId exists
  }, []);

  const LogoutUser = () => {
    try {
      setUser(""); // Clear user from context
      Cookies.remove("userId"); // Clear cookie
      setExistUser(false); // Update local state
      router.push("/login"); // Redirect to login
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="px-10 mb-10 mt-3">
      {existUser ? (
        <button
          onClick={LogoutUser}
          className="bg-blue-400 text-black rounded p-2"
        >
          Logout
        </button>
      ) : (
        <Link href="/login" className="bg-green-400 text-black rounded p-2">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
