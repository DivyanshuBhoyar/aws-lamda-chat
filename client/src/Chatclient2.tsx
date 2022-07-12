import React from "react";

interface Props {
  isConnected: boolean;
  members: string[];
  chatRows: React.ReactNode[];
  onPublicMessage: () => void;
  onPrivateMessage: (to: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ChatClient2 = (props: Props) => {
  const {
    chatRows,
    isConnected,
    members,
    onConnect,
    onDisconnect,
    onPrivateMessage,
    onPublicMessage,
  } = props;

  const Mybtn = () => {
    return (
      <button
        onClick={onPublicMessage}
        className="flex items-center justify-center px-4 py-4 ml-2 font-bold transition bg-pink-100 border-2 border-red-500 rounded-xl focus:outline-none focus:ring shadow-[4px_4px_0_0_#4287f5] hover:shadow-none active:bg-pink-50">
        Send public
        <span aria-hidden="true" className="ml-1.5" role="img">
          🚀
        </span>
      </button>
    );
  };

  const ChatBox = () => {
    return (
      <div className="w-3/4">
        <div className="w-full list-none  h-[90%] m-2 border-2 border-double   border-violet-500 py-6 px-2 border-r-0 hover:border-dashed ">
          {chatRows?.map((item, i) => (
            <li
              className="font-mono text-pink-900"
              key={i}
              style={{ paddingBottom: 9 }}>
              {item}
            </li>
          ))}
        </div>
        <div className="w-44">{isConnected && <Mybtn />}</div>
      </div>
    );
  };

  return (
    <div className="flex border-2 border-gray-500 m-1 w-11/12 mx-auto my-4  h-[90vh]  ">
      <div className="h-full relative  py-4 px-2  list-none  w-1/4 border-r-2 border-double  border-yellow-600 hover:border-dotted ">
        <div
          style={{
            position: "absolute",
            right: 9,
            top: 8,
            width: 16,
            height: 16,
            backgroundColor: props.isConnected ? "#00da00" : "#e2e2e2",
            borderRadius: 50,
          }}
        />
        <ul>
          <li>Click names to private msg.</li>
        </ul>
        <ol>
          {members.map((m) => (
            <li className="cursor-pointer my-2">
              <p
                className="text-teal-600 text-lg font-semibold"
                onClick={() => onPrivateMessage(m)}>
                {m} <span className="ml-3">💬 </span>
              </p>
            </li>
          ))}
        </ol>
        <div className="absolute bottom-0 flex gap-3 ">
          {!props.isConnected && (
            <button
              onClick={onConnect}
              className="bg-transparent mb-2  hover:bg-blue-500 text-blue-700  hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl ">
              Connect
            </button>
          )}
          {props.isConnected && (
            <button
              onClick={onDisconnect}
              className="bg-transparent mb-2  hover:bg-blue-500 text-blue-700  hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl ">
              Disconnect
            </button>
          )}
        </div>
      </div>
      <ChatBox />
    </div>
  );
};

export default ChatClient2;
