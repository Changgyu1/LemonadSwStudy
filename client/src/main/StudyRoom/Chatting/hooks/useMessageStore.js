// useMessageStore.js
import { useEffect, useState } from "react";
import useForceUpdate from "./useForceUpdate";
import { messageStore } from "../stores/MessageStore";

export default function useMessageStore() {
  const [messageLogs, setMessageLogs] = useState([]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    messageStore.subscribe(() => {
      setMessageLogs([...messageStore.messageLogs]);
    });

    return () => messageStore.unsubscribe(forceUpdate);
  }, [forceUpdate]);

  return {
    messageLogs,
    // 다른 상태 및 메서드들도 반환
  };
}
