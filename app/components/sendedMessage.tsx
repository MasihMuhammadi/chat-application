const SendedMessage = ({ message }: { message: any }) => {
  return (
    <>
      <p className="overflow-auto scrollbar-hide my-4 bg-blue-200 p-2 rounded text-black w-fit">
        {message}
      </p>
    </>
  );
};

export default SendedMessage;
