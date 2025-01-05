import React from "react";
import { FaSpinner } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import InputEmoji from "react-input-emoji";

const Input = ({
  newMessage,
  setNewMessage,
  handleOnEnter,
  sendMessage,
  isLoading,
}: {
  newMessage: any;
  setNewMessage: any;
  handleOnEnter: Function | any;
  sendMessage: Function | any;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className=" px-1">
        <div className="flex items-center gap-x-1">
          <div className="w-full  min-w-[280px] max-h-[100px] ">
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
          </div>
          <button
            className="bg-white text-[#04143A]  p-1 rounded-md border border-gray-300"
            onClick={sendMessage}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-black " />
            ) : (
              <IoMdSend className="text-2xl" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
export default Input;
