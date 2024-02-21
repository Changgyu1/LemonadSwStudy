// AuthContext.js

import { createContext, useContext, useState } from "react";
import tokenAxios from "../token/tokenAxios";

// 컨텍스트 생성
export const AuthContext = createContext();

// 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

// 컨텍스트를 다른 컴포넌트와 공유
export default function AuthProvider({ children }) {
  // 컨텍스트에 상태 추가
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState(false);
  const [token, setToken] = useState(null);

  // 로그인 함수
  async function login(username, password) {
    // tokenAxios를 사용하여 로그인 요청 보내기
    const response = await tokenAxios.get("/users/userinfo", {
      username,
      password,
    });
    try {
      if (response.status === 200) {
        // 토큰 추출
        const jwtToken = "Bearer " + response.data.token;

        // tokenAxios를 사용하여 서버로 인증된 요청 보내기
        const userDataResponse = await tokenAxios.get("/users/userinfo");

        // 받아온 사용자 데이터
        const userData = userDataResponse.data;

        // 인증 상태, 사용자 이름, 토큰 설정
        setAuthenticated(true);
        setUsername(username);
        setToken(jwtToken);

        // 여기서 userData를 활용하여 다양한 인증된 사용자의 정보를 처리할 수 있습니다.

        return true; // 로그인 성공
      } else {
        logout();
        return false;
      }
    } catch (error) {
      // 인증 오류 처리
      return false;
    }
  }

  // 로그아웃 함수
  function logout() {
    // 로그아웃 로직 구현
    // 인증 상태, 사용자 이름 및 토큰을 null로 설정
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, username, token, tokenAxios }}
    >
      {children}
    </AuthContext.Provider>
  );
}
