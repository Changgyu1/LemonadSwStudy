// Room.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMessageStore from "../hooks/useMessageStore";
import { messageStore } from "../stores/MessageStore"; // 이 줄 추가
import usersUserinfoAxios from "../../../token/tokenAxios";
const Room = () => {
  const { messageLogs } = useMessageStore();
  const { post_no } = useParams();
  const [connected, setConnected] = useState(false);

  const [userData, setUserData] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      // 토큰이 없으면 함수 실행 중단

      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        await messageStore.connectAndSubscribe(post_no);
        setConnected(true);
        console.log(connected); // 확인용 로그
        // 이후의 코드 실행 확인
        const response = await fetch(
          `http://localhost:8080/studyRoom/post/${post_no}`
        );
        const responseData = await response.json();
        messageStore.updateMessageLogs(responseData);
        messageStore.subscribe(() => {
          // WebSocket 메시지 수신 시 로그를 추가할 수 있습니다.
          console.log("Received a new message:", messageStore.messageLogs);
        });
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };

    fetchInitialMessages();

    return () => {
      messageStore.disconnect();
    };
  }, [post_no]);

  const beforeUnloadListener = () => {
    messageStore.disconnect();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnloadListener);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await messageStore.sendMessage({ type: "message" });

    // 전송 후 서버에서 메시지 다시 가져오기
    const response = await fetch(
      `http://localhost:8080/studyRoom/post/${post_no}`
    );
    const responseData = await response.json();
    messageStore.updateMessageLogs(responseData);
  };

  const handleChangeInput = (event) => {
    const { value } = event.target;
    messageStore.changeInput(value);
  };

  if (!connected) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-to-send">메시지 입력</label>
        <input
          type="text"
          value={messageStore.messageEntered}
          onChange={handleChangeInput}
        />
        <button type="submit">전송</button>
      </form>
      <ul>
        {messageLogs.map((message) => (
          <li
            key={message.message_id}
            style={{
              textAlign:
                message.nickname === userData.nickname ? "right" : "left",
            }}
          >
            <div
              style={{
                textAlign:
                  message.nickname === userData.nickname ? "right" : "left",
              }}
            >
              {message.nickname} {message.message && `: ${message.message}`}{" "}
            </div>
            <div
              style={{
                textAlign: "right",
              }}
            >
              {message.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Room;
