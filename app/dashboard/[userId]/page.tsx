"use client";

import { useUserContext } from "@/app/context/useAuthContext";
import axios from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";

const UserDashboard = () => {
  const { userId } = useParams();
  const { user, setUser }: any = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/user/search/${searchInput}/${userId}`,
        { withCredentials: true }
      );
      setSearchResult(response.data.data.users || []);
      setIsLoading(false);
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
    } catch (error) {
      console.log("Error sending friend request:", error);
    }
  };

  if (!userId) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 px-10">
        {isLoading ? (
          <Skeleton count={10} />
        ) : (
          <h1>
            Welcome {user?.data?.data?.user?.username || user?.data?.username}
          </h1>
        )}
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
