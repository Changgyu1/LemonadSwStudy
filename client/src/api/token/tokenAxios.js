import axios from 'axios';

const tokenAxios = axios.create({
  baseURL: 'http://localhost:8082', // 원하는 API 서버의 기본 URL로 수정
  timeout: 5000, // 요청이 5초 이상 걸리면 타임아웃 설정
});

// 요청 인터셉터 추가
tokenAxios.interceptors.request.use(
  async (config) => {
    // 토큰이 있다면 헤더에 설정
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default tokenAxios;
