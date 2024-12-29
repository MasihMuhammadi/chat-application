"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useUserContext } from "@/app/context/useAuthContext";
import Cookies from "js-cookie";
import CheckParams from "@/helper/helper";
import LetterProfile from "@/app/components/letterProfile";
import Input from "@/app/components/input";
import SendFlower from "@/app/components/sendFlower";
import Messages from "@/app/components/message";
import { FaArrowLeft, FaBackward } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

import ContentLoader from "react-content-loader";

const FriendsPage = () => {
  const route = useRouter();
  const { userId } = useParams();
  // const userId = user?.data?.data?._id || Cookies.get()
  const [friends, setFriends] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [onlineUser, setOnlineUser] = useState<any>(null);
  const [offlineUser, setOfflineUser] = useState<any>(null);
  const [matchedUsers, setMatchedUsers] = useState<any>(null);
  const { user, setUser }: any = useUserContext();
  const [bgColor, setBgColor] = useState("");
  const token = user?.data?.data?.token || Cookies.get("userId");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [friendsLoading, setFriendsLoading] = useState<boolean>(false);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

  // Reference to the chat container for scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    CheckParams(userId);
  }, [userId]);

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userId);

    socket.on("getOnlineUsers", (res: any) => {
      setOnlineUser(res);
    });

    return () => socket.off("getOnlineUsers");
  }, [socket]);

  useEffect(() => {
    if (!onlineUser || onlineUser.length === 0) return;
    const getOnlineUsersData = async () => {
      setFriendsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/user/friends`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(response?.data?.friends)) {
          // Filter online users
          const filteredUsers = response?.data?.friends.filter(
            (user: any) =>
              onlineUser.some((ou: any) => ou.userId === user._id) &&
              user._id !== userId // filter out yourself
          );
          setMatchedUsers(filteredUsers);

          // Filter offline users
          const offlines = response?.data?.friends.filter(
            (user: any) =>
              !onlineUser.some((ou: any) => ou.userId === user._id) &&
              user._id !== userId // filter out yourself
          );
          setOfflineUser(offlines);
          setFriendsLoading(false);
        } else {
          console.log("Data is not an array:", response?.data?.friends);
        }
      } catch (error) {
        console.log("Error fetching online users data:", error);
      }
    };

    getOnlineUsersData();
  }, [onlineUser]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/friends`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setFriends(response.data.friends || []);
      } catch (error) {
        console.log("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  const fetchMessages = async (friendId: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/messages?user1Id=${userId}&user2Id=${friendId}`,
        { withCredentials: true }
      );

      const updatedMessages = response.data.map((message: any) => ({
        ...message,
        isSent: message.sender === userId,
      }));

      setMessages(updatedMessages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("getMessage");
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    const message = {
      senderId: userId,
      receiverId: selectedFriend,
      text: newMessage.trim(),
    };

    try {
      setIsLoading(true);
      await axios.post(`${baseUrl}/api/messages/send`, message);
      socket.emit("sendMessage", message);

      setMessages((prev) => [...prev, { ...message, isSent: true }]);
      setNewMessage("");
      setIsLoading(false);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  function handleOnEnter(text: string) {
    setNewMessage(text);
    sendMessage();
  }

  const handleGoBack = () => {
    route.back();
  };

  const handleFlowerClick = () => {
    if (!selectedFriend) return;
    const flowerMessage = {
      senderId: userId,
      receiverId: selectedFriend,
      text: "🌸",
    };

    axios
      .post(`${baseUrl}/api/messages/send`, flowerMessage)
      .then(() => {
        socket.emit("sendMessage", flowerMessage);
        setMessages((prev) => [...prev, { ...flowerMessage, isSent: true }]);
      })
      .catch((error) => {
        console.log("Error sending flower emoji:", error);
      });
  };

  useEffect(() => {
    const randomColor = () => {
      const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-teal-500",
      ];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    };

    setBgColor(randomColor());
  }, []);

  return (
    <div>
      <button
        onClick={handleGoBack}
        className="mx-6 bg-white border border-black rounded p-1 mb-4 "
      >
        <FaArrowLeft />
      </button>
      <div className="flex sm:flex-row flex-col">
        {friendsLoading ? (
          <div className="">
            <ContentLoader
              speed={2}
              width={400}
              height={160}
              viewBox="0 0 400 160"
              backgroundColor="#121622"
              foregroundColor="#ecebeb"
            >
              <div>
                <rect
                  x="48"
                  y="8"
                  rx="3"
                  ry="3"
                  width="88"
                  height="20"
                  className="bg-[#121622]"
                />
              </div>
              <div>
                <rect x="48" y="26" rx="3" ry="3" width="52" height="20" />
              </div>

              {/* <circle cx="20" cy="20" r="20" /> */}
            </ContentLoader>
          </div>
        ) : (
          <div className="w-full sm:w-1/4 p-4">
            <div className="flex flex-col gap-y-5">
              <div className="flex sm:flex-row bg-[#121622] rounded-xl p-3 md:flex-col gap-2 relative">
                <div className="w-3 h-3 bg-green-600 text-right rounded-full absolute right-3"></div>
                <h1 className="text-[13px] hidden md:flex text-white text-center mb-3">
                  Online Friends{" "}
                </h1>
                {matchedUsers?.length > 0 ? (
                  matchedUsers?.map((u: any) => (
                    <div
                      key={u._id}
                      className="flex items-center  mb-4 gap-x-2"
                    >
                      <LetterProfile
                        bgColor={bgColor}
                        username={u.username}
                        isSelected={selectedFriend === u._id}
                        userId={u._id}
                        setSelectedFriend={setSelectedFriend}
                        fetchMessages={fetchMessages}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-white px-4">nobody is online</p>
                )}
              </div>

              <div className="bg-[#121622] w-full rounded-xl p-3 text-white">
                <div className="w-3 h-3 bg-red-600   float-end rounded-full"></div>
                <h1 className="text-[13px] text-white text-center mb-3 hidden md:flex">
                  Offline Friends{" "}
                </h1>
                <div className="">
                  {offlineUser?.length > 0 ? (
                    offlineUser?.map((friend: any) => (
                      <div
                        key={friend._id}
                        className="flex  gap-x-2 mt-5 items-center  mb-3 "
                      >
                        <LetterProfile
                          bgColor={bgColor}
                          username={friend.username}
                          isSelected={selectedFriend === friend._id}
                          userId={friend._id}
                          setSelectedFriend={setSelectedFriend}
                          fetchMessages={fetchMessages}
                        />
                      </div>
                    ))
                  ) : (
                    <>
                      <p className="text-white px-4">everybody is online</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Chat Section */}
        <div className="w-auto sm:w-3/4 p-4  scrollable">
          {selectedFriend ? (
            <>
              <div className="border p-4 h-[500px] rounded-lg overflow-y-auto bg-[#121622]  scrollable ">
                <div className="bg-[#04143A] py-3 rounded-3xl shadow-2xl backdrop-blur-lg p-6 mx-4 mb-10 px-5">
                  <div className="flex gap-x-2 items-center font-semibold">
                    <LetterProfile
                      bgColor={bgColor}
                      username={
                        friends.find((f) => f._id === selectedFriend)
                          ?.username ||
                        matchedUsers?.find((u: any) => u._id === selectedFriend)
                          ?.username
                      }
                    />
                  </div>
                </div>
                {messages?.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className=" ">
                      <Messages message={message} />
                    </div>
                  ))
                ) : (
                  <SendFlower
                    handleFlowerClick={handleFlowerClick}
                    username={
                      friends.find((f) => f._id === selectedFriend)?.username
                    }
                  />
                )}
                {/* Scroll to bottom */}
                <div ref={messagesEndRef} />
              </div>

              <Input
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleOnEnter={handleOnEnter}
                sendMessage={sendMessage}
                isLoading={isLoading}
              />
            </>
          ) : (
            <div className="border p-4 h-[500px] rounded-lg overflow-y-auto bg-[#121622] text-center flex items-center justify-center text-3xl text-white">
              Select a chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
