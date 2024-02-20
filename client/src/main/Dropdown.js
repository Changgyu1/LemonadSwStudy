import { useNavigate } from "react-router-dom";
import { logout, isTokenAvailable } from "../token/tokenAxios";

export default function Dropdown() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (isTokenAvailable() !== null) {
      // 로그아웃이 성공했을 때의 추가 작업
      // 예: 리다이렉트 등
      localStorage.removeItem("token");

      navigate("/"); // 예시로 홈페이지로 리다이렉트하는 경우
      window.location.reload();
    } else {
      // 로그아웃이 실패했을 때의 추가 작업
      console.error("로그아웃 실패");
    }
  };
  return (
    <div>
      <ul>
        <li>
          <a href="/mypage">마이페이지</a>
        </li>
        <li>
          <a href="/modify">회원정보수정</a>
        </li>
        <li>
          <a onClick={handleLogout} href="/">
            로그아웃
          </a>
        </li>
      </ul>
    </div>
  );
}
