"use client";
import { useUserContext } from "@/app/context/useAuthContext";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const RequestsPage = () => {
  const { userId } = useParams(); // Access userId from route
  const baseUrl = "https://chat-backend-1096.onrender.com";
  const [requests, setRequests] = useState([]);
  const { user, setUser }: any = useUserContext();

  const route = useRouter();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/user/${userId}/requests`,
          { withCredentials: true }
        );

        setRequests(response.data.friendRequests || []);
      } catch (error) {
        console.log("Error fetching user requests:", error);
      }
    };

    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const acceptRequest = async (requesterId: any) => {
    const response = await axios.post(`${baseUrl}/api/user/accept-request`, {
      userId: userId,
      requesterId: requesterId,
    });
  };
  const handleGoBack = () => {
    route.back();
  };

  return (
    <div className="px-4">
      <button
        onClick={handleGoBack}
        className="bg-white border border-black rounded p-1 mb-4 "
      >
        {"<- "}Back
      </button>
      <h1>
        Your Requests dear <b>{user?.data?.data.username}</b>
      </h1>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request: any) => (
            <li className="text-red-500 flex justify-between" key={request._id}>
              {request.username}
              <button
                className="bg-white border-black text-black rounded p-3 "
                onClick={() => acceptRequest(request._id)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          There is no requests yet!!
        </p>
      )}
    </div>
  );
};

export default RequestsPage;
