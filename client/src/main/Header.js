import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import { useEffect, useState } from "react";
import { logout, isTokenAvailable } from "../token/tokenAxios";
import { useNavigate } from "react-router-dom";
import usersUserinfoAxios from "../token/tokenAxios";

import "../css/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "./Dropdown";

export default function Header() {
  const [userData, setUserData] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
        console.log(userData);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);
  const [view, setView] = useState(false);

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
    <header className="border-bottom border-light border-5 mb-5 p-2">
      <div className="container">
        <div className="row">
          <nav className="nav_section">
            <div className="navbar-brand_font" style={{ paddingTop: "30px" }}>
              <a className="nav-link" href="/">
                S.With
              </a>
            </div>

            <ul className="navbar-nav_2">
              {userData.user_role === "ADMIN" && isTokenAvailable() && (
                <li className="nav-item">
                  <div className="write">
                    <div className="write_1">
                      <a className="nav-link" href="/admin">
                        <img
                          className="write_img"
                          src={process.env.PUBLIC_URL + "../img/setting.png"}
                          alt="setting"
                        />
                      </a>
                    </div>
                  </div>
                </li>
              )}

              {isTokenAvailable() && (
                <li className="nav-item">
                  <div className="write">
                    <div className="write_1">
                      <a className="nav-link" href="/new">
                        <img
                          className="write_img"
                          src={process.env.PUBLIC_URL + "../img/writing.png"}
                          alt="newwriting"
                        />
                      </a>
                    </div>
                  </div>
                </li>
              )}
              {isTokenAvailable() && (
                <li className="nav-item">
                  <div className="alarm">
                    <div className="alarm_1">
                      <img
                        className="alarm_img"
                        src={process.env.PUBLIC_URL + "../img/bell.png"}
                        alt="alarm"
                      />
                    </div>
                  </div>
                </li>
              )}
              {!isTokenAvailable() && (
                <li className="nav-item">
                  <div className="profile">
                    <div className="profile_1">
                      <a className="nav-link" href="/login">
                        <img
                          className="login_img"
                          src={process.env.PUBLIC_URL + "../img/login.png"}
                          alt="login"
                        />
                      </a>
                    </div>
                  </div>
                </li>
              )}
              {isTokenAvailable() && (
                <li className="nav-item">
                  <div className="profile">
                    <div className="profile_1">
                      <img
                        className="profile_img"
                        src={`data:image/jpeg;base64,${userData.user_profile}`}
                        alt="profile"
                      />
                    </div>
                  </div>
                </li>
              )}
              {isTokenAvailable() && (
                <li className="profileItem">
                  <ul
                    onClick={() => {
                      setView(!view);
                    }}
                  >
                    반가워요, {userData.nickname} 님! {view ? "⌃" : "⌄"}
                    {view && <Dropdown />}
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
