import React, { useState, useEffect, useCallback, useRef } from "react";

// import { ChatClient } from "./ChatClient";
import ChatClient2 from "./Chatclient2";

const URL = "wss://to7r3ms4d0.execute-api.us-east-1.amazonaws.com/production/";

const App = () => {
  const socket = useRef<WebSocket | null>(null); // react way of setting websockets browser api
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState<React.ReactNode[]>([]);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener("open", onSocketOpen);
      socket.current.addEventListener("close", onSocketClose);
      socket.current.addEventListener("message", (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  //incoming events : open message close
  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    const name = prompt("Enter your name");
    socket.current?.send(JSON.stringify({ action: "setName", name }));
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);

  const onSocketMessage = useCallback((dataStr: string) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows((oldArray) => [
        ...oldArray,
        <span>
          <b>{data.publicMessage}</b>
        </span>,
      ]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      setChatRows((oldArray) => [
        ...oldArray,
        <span>
          <i>{data.systemMessage}</i>
        </span>,
      ]);
    }
  }, []);

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);

  // outgoing events private/public
  const onSendPrivateMessage = useCallback((to: string) => {
    const message = prompt("Enter private message for " + to);
    socket.current?.send(
      JSON.stringify({
        action: "sendPrivate",
        message,
        to,
      })
    );
  }, []);

  const onSendPublicMessage = useCallback(() => {
    const message = prompt("Enter public message");
    socket.current?.send(
      JSON.stringify({
        action: "sendPublic",
        message,
      })
    );
  }, []);

  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close();
    }
  }, [isConnected]);

  return (
    <div>
      {/* <ChatClient
        isConnected={isConnected}
        members={members}
        chatRows={chatRows}
        onPublicMessage={onSendPublicMessage}
        onPrivateMessage={onSendPrivateMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      /> */}
      <ChatClient2
        isConnected={isConnected}
        members={members}
        chatRows={chatRows}
        onPublicMessage={onSendPublicMessage}
        onPrivateMessage={onSendPrivateMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    </div>
  );
};

export default App;
