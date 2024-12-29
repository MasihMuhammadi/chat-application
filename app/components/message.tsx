import React from "react";

const Messages = ({ message }: { message: any }) => {
  return (
    <>
      <div
        className={` relative pb-5 z-[1000]${
          message.isSent
            ? "text-right p-3 rounded-md rounded-tl-3xl bg-[#0031B8] text-white  my-4 ml-auto max-w-[50%] text-wrap break-words overflow-y-auto"
            : "text-left p-3 rounded-md  bg-[#1A2133] rounded-tr-3xl text-white my-4  mr-auto max-w-[50%] text-wrap break-words overflow-y-auto"
        }`}
      >
        <div className="absolute  right-2 bottom-1 text-[9px]">
          {new Date(message?.createdAt || Date.now()).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}
        </div>

        {message.text}
      </div>
    </>
  );
};
export default Messages;
