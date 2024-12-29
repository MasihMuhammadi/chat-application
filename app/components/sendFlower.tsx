import React from "react";

const SendFlower = ({
  handleFlowerClick,
  username,
}: {
  handleFlowerClick: any;
  username: any;
}) => {
  return (
    <>
      <>
        <p
          onClick={handleFlowerClick}
          className="text-center text-[80px] mt-32 cursor-pointer"
        >
          🌸
        </p>
        <p className="text-center text-white capitalize">
          Tap and Send a Hyacinth to {username}
        </p>
      </>
    </>
  );
};
export default SendFlower;
