import React from "react";
import { number } from "yup";

const LetterProfile = ({
  username,
  bgColor,
  isSelected,
  userId,
  setSelectedFriend,
  fetchMessages,
}: {
  username: any;
  bgColor: any;
  isSelected?: boolean;
  userId?: any;
  setSelectedFriend?: any;
  fetchMessages?: any;
}) => {
  return (
    <>
      <p
        className={`w-8 h-8 text-center text-xl capitalize ${bgColor} text-white rounded-full`}
      >
        {username[0]}
      </p>
      <div
        className={`cursor-pointer  ${
          isSelected ? "text-blue-500" : "text-white"
        }`}
        onClick={() => {
          setSelectedFriend(userId);
          fetchMessages(userId);
        }}
      >
        {username}
      </div>
    </>
  );
};
export default LetterProfile;
