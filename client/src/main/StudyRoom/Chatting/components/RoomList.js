import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMessageStore from "../hooks/useMessageStore";

export default function RoomList() {
  const messageStore = useMessageStore();
  const { connected, currentRoomIndex } = messageStore;

  const { post_no } = useParams();

  useEffect(() => {
    // 현재 주소에서 post_no 값을 추출하여 방에 자동으로 참여
    if (post_no && connected && post_no !== currentRoomIndex) {
      messageStore.disconnect(currentRoomIndex);
      messageStore.connect(post_no);
    }
  }, [post_no, connected, currentRoomIndex, messageStore]);

  const handleClickQuitRoom = () => {
    messageStore.disconnect(currentRoomIndex);
  };

  return (
    <div>
      <button type="button" disabled={!connected} onClick={handleClickQuitRoom}>
        연결 종료
      </button>
    </div>
  );
}
