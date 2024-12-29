"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import InputEmoji from "react-input-emoji";
import { useUserContext } from "@/app/context/useAuthContext";
import Emoji from "react-emoji-render";
import Cookies from "js-cookie";
import CheckParams from "@/helper/helper";

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
  const [isSended, setIsSended] = useState<boolean>(false);
  const { user, setUser }: any = useUserContext();
  const [bgColor, setBgColor] = useState("");
  const token = user?.data?.data?.token || Cookies.get("userId");

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

      // Process each message and add a flag to identify if the message is sent or received
      const updatedMessages = response.data.map((message: any) => ({
        ...message,
        isSent: message.sender === userId, // true for sent messages, false for received ones
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

  // Scroll to bottom whenever messages are updated or a friend is selected
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
      // Send message via backend
      await axios.post(`${baseUrl}/api/messages/send`, message);

      // Emit the message to the socket server
      socket.emit("sendMessage", message);

      // Update local state for instant feedback
      setMessages((prev) => [...prev, { ...message, isSent: true }]);
      setNewMessage(""); // Clear the input after sending
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
      text: "🌸", // The flower emoji as the message text
    };

    // Send the flower emoji message to the backend
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
    // Function to generate a random background color
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
      {/* <button
        onClick={handleGoBack}
        className="mx-6 bg-white border border-black rounded p-1 mb-4 "
      >
        {"<- "}Back
      </button> */}
      <div className="flex sm:flex-row flex-col">
        <div className="w-1/4 p-4">
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-row bg-[#121622] rounded-xl p-3 md:flex-col gap-2 relative">
              <div className="w-3 h-3 bg-green-600 text-right rounded-full absolute right-3"></div>
              <h1 className="text-[13px] text-white text-center mb-3">
                Online Friends{" "}
              </h1>
              {matchedUsers?.length > 0 ? (
                matchedUsers?.map((u: any) => (
                  <div key={u._id} className="flex items-center  mb-4 gap-x-2">
                    <p
                      className={`w-8 h-8 text-center text-xl capitalize ${bgColor} text-white rounded-full`}
                    >
                      {u.username[0]}
                    </p>
                    <div
                      className={`cursor-pointer  ${
                        selectedFriend === u._id
                          ? "text-blue-500"
                          : "text-white"
                      }`}
                      onClick={() => {
                        setSelectedFriend(u._id);
                        fetchMessages(u._id);
                      }}
                    >
                      {u.username}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white px-4">nobody is online</p>
              )}
            </div>

            <div className="bg-[#121622] rounded-xl p-3 text-white">
              <div className="w-3 h-3 bg-red-600 float-end rounded-full"></div>
              <h1 className="text-[13px] text-white text-center mb-3">
                Offline Friends{" "}
              </h1>
              <div className="">
                {offlineUser?.length > 0 ? (
                  offlineUser?.map((friend: any) => (
                    <div
                      key={friend._id}
                      className="flex items-center  mb-3  gap-x-2"
                    >
                      <p
                        className={`w-8 h-8 text-center  text-2xl capitalize ${bgColor} text-white rounded-full`}
                      >
                        {friend.username[0]}
                      </p>
                      <div
                        className={`cursor-pointer  ${
                          selectedFriend === friend._id
                            ? "text-blue-500"
                            : "text-white"
                        }`}
                        onClick={() => {
                          setSelectedFriend(friend._id);
                          fetchMessages(friend._id);
                        }}
                      >
                        {friend.username}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <p className="text-white px-4">everybody is online</p>
                    {/* <p className="text-white px-4">every  </p> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-auto sm:w-3/4 p-4 no-scroll">
          {selectedFriend ? (
            <>
              <div className="border p-4 h-[600px] rounded-lg overflow-y-auto bg-[#121622] no-scroll relative">
                <div className="bg-[#04143A] py-3 rounded-3xl shadow-2xl backdrop-blur-lg p-6 mx-4 mb-10 px-5">
                  <div className="flex gap-x-2 items-center font-semibold">
                    <div className="rounded-full capitalize text-lg px-3 py-1 bg-green-500 text-white">
                      {friends.find((f) => f._id === selectedFriend)
                        ?.username[0] ||
                        matchedUsers?.find((u: any) => u._id === selectedFriend)
                          ?.username[0]}
                    </div>
                    <h2 className="text-white">
                      {friends.find((f) => f._id === selectedFriend)
                        ?.username ||
                        matchedUsers?.find((u: any) => u._id === selectedFriend)
                          ?.username}
                    </h2>
                  </div>
                </div>
                {messages?.length > 0 ? (
                  messages.map((message, index) => (
                    <div key={index} className=" ">
                      <div
                        className={` relative z-[1000]${
                          message.isSent
                            ? "text-right p-3 rounded-md rounded-tl-3xl bg-[#0031B8] text-white  my-4 ml-auto max-w-[50%] text-wrap break-words overflow-y-auto"
                            : "text-left p-3 rounded-md  bg-[#1A2133] rounded-tr-3xl text-white my-4  mr-auto max-w-[50%] text-wrap break-words overflow-y-auto"
                        }`}
                      >
                        <div className="absolute right-2 bottom-1 text-[9px]">
                          {new Date(
                            message?.createdAt || Date.now()
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>

                        {message.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <p
                      onClick={handleFlowerClick}
                      className="text-center text-[80px] mt-32 cursor-pointer"
                    >
                      🌸
                    </p>
                    <p className="text-center text-white capitalize">
                      Tap and Send a Hyacinth to{" "}
                      {friends.find((f) => f._id === selectedFriend)?.username}
                    </p>
                  </>
                )}
                {/* Scroll to bottom */}
                <div ref={messagesEndRef} />
                <div className="absolute bottom-1 right-0 w-full max-w-full px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <InputEmoji
                        height={400}
                        shouldReturn={false}
                        shouldConvertEmojiToImage={false}
                        value={newMessage}
                        onChange={setNewMessage}
                        cleanOnEnter
                        onEnter={handleOnEnter}
                        placeholder="Type a message"
                        borderRadius={5}
                      />
                    </div>
                    <button
                      className="bg-white text-[#04143A] px-4 py-2 rounded-md border border-gray-300"
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="border p-4 h-[600px] rounded-lg overflow-y-auto bg-[#121622] text-center flex items-center justify-center text-3xl text-white">
              Select a chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
