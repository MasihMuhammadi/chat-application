"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import InputEmoji from "react-input-emoji";
import { useUserContext } from "@/app/context/useAuthContext";

const FriendsPage = () => {
  const route = useRouter();
  const { userId } = useParams();
  const [friends, setFriends] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [onlineUser, setOnlineUser] = useState<any>(null);
  const [matchedUsers, setMatchedUsers] = useState<any>(null);
  const [isSended, setIsSended] = useState<boolean>(false);
  const { user, setUser }: any = useUserContext();
  const baseUrl = "http://localhost:5000";

  // Reference to the chat container for scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      const response = await axios.get(`${baseUrl}/api/user/get`, {
        withCredentials: true,
      });

      setMatchedUsers(
        response.data.data.filter((user: any) =>
          onlineUser.some((onlineUser: any) => onlineUser.userId === user._id)
        )
      );
    };

    getOnlineUsersData();
  }, [onlineUser]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/user/friends/${userId}`,
          { withCredentials: true }
        );
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
    // Call sendMessage when Enter is pressed in InputEmoji
    setNewMessage(text);
    sendMessage();
  }

  const handleGoBack = () => {
    route.back();
  };

  return (
    <div>
      <button
        onClick={handleGoBack}
        className="mx-6 bg-white border border-black rounded p-1 mb-4 "
      >
        {"<- "}Back
      </button>
      <div className="flex sm:flex-row flex-col">
        <div className="w-1/4  p-4">
          <h2>Friends List</h2>
          <div className="flex flex-row md:flex-col gap-2">
            {friends.map((friend) => (
              <div key={friend._id} className="flex  gap-x-1 my-4">
                <div className="capitalize text-xl text-white bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center">
                  {friend.username[0]}
                </div>
                <div
                  className={`cursor-pointer  ${
                    selectedFriend === friend._id ? "text-blue-500" : ""
                  }`}
                  onClick={() => {
                    setSelectedFriend(friend._id);
                    fetchMessages(friend._id);
                  }}
                >
                  {friend.username}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-auto sm:w-3/4 p-4 no-scroll">
          {selectedFriend ? (
            <>
              <h2>
                Chat with{" "}
                {friends.find((f) => f._id === selectedFriend)?.username}
              </h2>
              <div className="border p-4 h-96 overflow-y-auto bg-gradient-to-tr from-emerald-50 to-violet-200 no-scroll">
                {messages.map((message, index) => (
                  <div key={index} className="relative ">
                    <div
                      className={`  z-[1000]${
                        message.isSent
                          ? "text-right p-3 rounded-md bg-gradient-to-tr text-white  from-blue-400 to-blue-900 my-4 ml-auto max-w-[50%] text-wrap break-words overflow-y-auto"
                          : "text-left p-3 rounded-md  bg-slate-900 text-white my-4  mr-auto max-w-[50%] text-wrap break-words overflow-y-auto"
                      }`}
                    >
                      {message.isSent ? (
                        <div className="absolute w-3   rounded-tr-[50px] h-2 bg-gradient-to-b -z-10 text-white  from-blue-900 to-blue-400 -right-1 bottom-0 rotate-12 "></div>
                      ) : (
                        <div className="absolute w-3   rounded-tr-[50px] h-2 bg-slate-900 -z-10 -left-1 bottom-0 rotate-[120deg] "></div>
                      )}

                      {message.text}
                    </div>
                  </div>
                ))}
                {/* Scroll to bottom */}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex mt-4">
                <InputEmoji
                  shouldReturn={false}
                  shouldConvertEmojiToImage={false}
                  value={newMessage}
                  onChange={setNewMessage}
                  cleanOnEnter
                  onEnter={handleOnEnter}
                  placeholder="Type a message"
                  borderRadius={5}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 ml-2"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p>Select a friend to chat with.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
