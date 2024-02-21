/* eslint-disable class-methods-use-this */
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useState } from "react";
import { messageService } from "../Service/MessageService";
import usersUserinfoAxios from "../../../../token/tokenAxios";
const baseUrl = "http://localhost:8080";

export default class MessageStore {
  constructor(nickname) {
    this.listeners = new Set();

    this.nickname = nickname;

    this.socket = null;
    this.client = null;
    this.connected = false;

    this.currentRoomIndex = 0;
    this.messageEntered = "";

    this.messageLogs = [];
  }

  setNicknameId = async () => {
    try {
      const response = await usersUserinfoAxios.get("/users/userinfo");
      const NickName = response.data.nickname;
      this.nickname = NickName;
      this.publish(); // 변경된 user_no를 알림
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
  };

  connect(post_no) {
    return new Promise((resolve, reject) => {
      console.log("WebSocket 연결을 초기화 중입니다...");
      this.socket = new SockJS(`${baseUrl}/chat`);
      this.client = Stomp.over(this.socket);

      this.currentRoomIndex = post_no;

      this.client.connect(
        {},
        () => {
          console.log("WebSocket 연결이 수립되었습니다.");
          this.connected = true;
          this.publish();
          resolve(); // 연결이 완료되면 resolve 호출
        },
        (error) => {
          console.error("WebSocket 연결에 실패했습니다.", error);
          reject(error); // 연결 실패 시 reject 호출
        }
      );
    });
  }

  async connectAndSubscribe(post_no, nickname) {
    try {
      this.setNicknameId(nickname); // 연결 및 구독 시 userId를 설정합니다.
      await this.connect(post_no);

      this.subscribeMessageBroker(post_no);
      // 여기에 메시지 로딩 부분을 추가
      const response = await fetch(
        `http://localhost:8080/studyRoom/post/${post_no}`
      );
      const responseData = await response.json();
      this.updateMessageLogs(responseData); // 업데이트된 메시지로그 설정
    } catch (error) {
      console.error("연결 및 구독 중 오류 발생:", error);
    }
  }

  subscribeMessageBroker(post_no, nickname) {
    //메세지 방 입장
    this.client.connect({}, () => {
      this.setNicknameId(nickname);
      this.client.subscribe(
        `/subscription/chat/room/${post_no}`,
        (messageReceived) => this.receiveMessage(messageReceived),
        {}
      );

      this.sendMessage({ type: "enter" });
    });
  }

  disconnect = () => {
    console.log("WebSocket 연결을 해제합니다...");
    if (this.connected) {
      // 연결이 성립된 경우에만 연결 해제
      this.sendMessage({ type: "quit" });
      this.client.unsubscribe();
      this.client.disconnect();

      this.connected = false;
      this.currentRoomIndex = 0;
      this.messageEntered = "";
      this.messageLogs = [];
      this.publish();
    } else {
      console.warn(
        "WebSocket 연결이 아직 수립되지 않았습니다. 연결 해제를 건너뜁니다."
      );
    }
  };
  updateMessageLogs = (newMessageLogs) => {
    this.messageLogs = newMessageLogs;
    this.publish();
  };
  changeInput(value) {
    this.messageEntered = value;
    this.publish();
  }

  sendMessage({ type }) {
    console.log("sendMessage called, connected:", this.connected);

    if (this.connected) {
      const message = type === "message" ? this.messageEntered : "";

      messageService.sendMessage({
        client: this.client,
        messageToSend: {
          type,
          post_no: this.currentRoomIndex,
          nickname: this.nickname,
          message,
        },
      });
      console.log(this.nickname);
      this.messageEntered = "";
      this.publish();
    } else {
      console.error(
        "연결이 아직 수립되지 않았습니다. 메시지를 보낼 수 없습니다."
      );
    }

    this.messageEntered = "";
    this.publish();
  }

  receiveMessage(messageReceived) {
    //메세지 입력 창 전송 버튼 누르면 전송되는 거
    const message = JSON.parse(messageReceived.body);
    console.log("Received message:", message);
    this.messageLogs = [...this.messageLogs, this.formatMessage(message)];
    this.publish();
  }

  formatMessage(message) {
    return {
      message_id: message.message_id,
      value: `${message.value} (${new Date().toLocaleTimeString()})`,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  publish() {
    this.listeners.forEach((listener) => listener());
  }
}

export const messageStore = new MessageStore();
