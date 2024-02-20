import axios from "axios";

const tokenAxios = axios.create({
  baseURL: "http://lemonadswith.store", // 원하는 API 서버의 기본 URL로 수정
  timeout: 5000, // 요청이 5초 이상 걸리면 타임아웃 설정
});

// 요청 인터셉터 추가
tokenAxios.interceptors.request.use(
  async (config) => {
    // 토큰이 있다면 헤더에 설정
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export const isTokenAvailable = () => {
  try {
    const token = localStorage.getItem("token");
    // 토큰이 존재하고 유효한 경우 true 반환
    return token !== null && token !== undefined && token !== "" && typeof token === "string";
  } catch (error) {
    console.error("토큰 확인 중 에러 발생:", error);
    return false; // 에러 발생 시에도 false 반환
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("token");
    // 다른 로그아웃 처리를 수행할 수 있음
    // 예: 리다이렉트 등
    return true; // 성공적으로 로그아웃 처리됨
  } catch (error) {
    console.error("로그아웃 중 에러 발생:", error);
    return false; // 로그아웃 중 에러 발생
  }
};

export default tokenAxios;
