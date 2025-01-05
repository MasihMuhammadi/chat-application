"use client";
import Link from "next/link";
import { useUserContext } from "../context/useAuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./logo";
import Notification from "./notification";

const Navbar = () => {
  //   const [existUser, setExistUser] = useState(false); // Local state to store cookie value
  // const {existUser,setExistUser} = useUserContext()
  const router = useRouter();
  const { user, setUser, existUser, setExistUser }: any = useUserContext();
  const [notification, setNotification] = useState({
    isShow: false,
    content: "",
    success: false,
  });

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
      setNotification({
        isShow: true,
        content: "Logout successfully!",
        success: true,
      });
      setTimeout(() => {
        router.push(`/login`);
      }, 4000);
    } catch (err: any) {
      setNotification({
        isShow: true,
        content: "Logout failed try Agian!",
        success: false,
      });
      ``;
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setNotification({
        isShow: false,
        content: "",
        success: true,
      });
    }, 5000);
  }, [notification]);

  return (
    <div>
      {notification?.isShow && (
        <Notification
          isShow={notification.isShow}
          success={notification.success}
        >
          {notification.content}
        </Notification>
      )}
      <div className="px-10 mb-10 mt-3 flex justify-between">
        {existUser ? (
          <button
            onClick={LogoutUser}
            className="bg-white border border-black text-black  hover:bg-black hover:text-white transition-all duration-200  rounded p-2"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-[#04143A] text-white rounded p-2">
            Login
          </Link>
        )}
        <Logo />
      </div>
    </div>
  );
};

export default Navbar;
