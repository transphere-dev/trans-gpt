import { useEffect, useState, useContext } from "react";
import ChatContext from "../contexts/ChatContext";

export default function useChatStream(chat) {
  const { stream } = useContext(ChatContext);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!stream || !chat) return;

    const handleStreamData = (data) => {
      if (data.chatId === chat.id) {
        setResult(data.result);
      }
    };

    stream.addEventListener("data", handleStreamData);

    return () => {
      stream.removeEventListener("data", handleStreamData);
    };
  }, [stream, chat]);

  return result;
}
