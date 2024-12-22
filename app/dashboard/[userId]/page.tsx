"use client";

import { useUserContext } from "@/app/context/useAuthContext";
import axios from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserDashboard = () => {
  const { userId } = useParams(); // Access userId from route params
  const searchParams = useSearchParams(); // Access query parameters
  const username = searchParams.get("username"); // Get username from query params
  const { user, setUser }: any = useUserContext();

  const baseUrl = "http://localhost:5000";
  const [friends, setFriends] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // Fetch user's friends on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/get/${userId}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response);
          // Assuming the user data is returned in response.data
          const userData = response.data;

          // You can attach the user data in the response if needed, like setting cookies or headers
          // const responseWithUser = NextResponse.next();
          // responseWithUser.headers.set("X-User-Data", JSON.stringify(userData));

          // Redirect logged-in users to their dashboard if accessing login or homepage
        }
      } catch (error) {
        console.error("Error fetching user data in middleware:", error);
      }
    };
    getUserData();
  }, []);

  // Handle user search
  const searchUsers = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/user/search/${searchInput}/${userId}`,
        { withCredentials: true }
      );
      setSearchResult(response.data.data.users || []);
    } catch (error) {
      console.log("Error searching users:", error);
    }
  };
  const sendRequest = async (receiverId: any) => {
    try {
      const response = await axios.post(`${baseUrl}/api/user/send-request`, {
        senderId: userId,
        receiverId: receiverId,
      });
      console.log("Request sent:", response.data);
    } catch (error) {
      console.log("Error sending friend request:", error);
    }
  };

  if (!userId) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 px-10">
        <h1>Welcome {user?.data?.data?.username || user?.data?.username}</h1>
        <div className="flex">
          <input
            type="text"
            className="border border-black rounded px-2 py-1  "
            placeholder="Search by username"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-black rounded px-2 py-1 border text-white"
            onClick={searchUsers}
          >
            Search
          </button>
        </div>

        <div className="flex gap-x-4  items-center ">
          <Link
            href={`/dashboard/${userId}/requests`}
            className="bg-white rounded px-2 py-1 border border-black"
          >
            Request
          </Link>
          <Link
            href={`/dashboard/${userId}/friends`}
            className="bg-white rounded px-2 py-1 border border-black"
          >
            Freinds
          </Link>
        </div>
      </div>

      <div className="">
        {searchResult.map((user: any) => (
          <div
            key={user._id}
            className="px-6 mt-10 flex items-start justify-between"
          >
            <div className="flex gap-x-1">
              <p className="capitalize text-sm bg-blue-400 text-white rounded-full px-2 py-1">
                {user.username[0]}
              </p>
              <span>{user.username}</span>
            </div>
            {user.relationshipStatus === "friend" ? (
              <Link
                href={`${userId}/friends`}
                className="text-sm  bg-blue-400 rounded-md p-2"
              >
                Send Message
              </Link>
            ) : user.relationshipStatus === "sentRequest" ? (
              <button className="text-sm bg-blue-400 rounded-md p-2">
                Pending
              </button>
            ) : user.relationshipStatus === "receivedRequest" ? (
              <button className="text-sm bg-blue-400 rounded-md p-2">
                Accept Request
              </button>
            ) : (
              <button
                className="text-sm bg-blue-400 rounded-md p-2"
                onClick={() => sendRequest(user._id)}
              >
                Send Request
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
