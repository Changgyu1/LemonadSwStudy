import React, { useEffect } from "react";
import { isTokenAvailable, logout } from "./token/tokenAxios";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import "./App.css";
import Control from "./main/Control";
import RoomEnd from "./main/StudyRoom/RoomEnd";

const App = () => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          // 토큰이 만료된 경우
          logout(); // 로그아웃 처리 메서드 호출
        }
      }
    };

    // 일정 주기로 토큰 만료 여부 확인 (예: 5분마다)
    const expirationIntervalId = setInterval(checkTokenExpiration, 300000);

    const checkTokenValidity = () => {
      if (isTokenAvailable()) {
        // 토큰이 유효한지 여부 확인
        // 예: 만료 시간 확인 및 필요에 따른 로그아웃 처리
        // 예: 특정 API를 호출하여 토큰 유효성 검사
      }
    };

    // 일정 주기로 토큰 유효성 체크 (예: 5분마다)
    const validityIntervalId = setInterval(checkTokenValidity, 300000);

    // 컴포넌트가 언마운트될 때 타이머 해제
    return () => {
      clearInterval(expirationIntervalId);
      clearInterval(validityIntervalId);
    };
  }, []);

  return (
    <div className="App">
      <Control />
      <RoomEnd />
    </div>
  );
};

export default App;
