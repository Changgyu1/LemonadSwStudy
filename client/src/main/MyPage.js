import axios from "axios";
import Header from "./Header";
import React, { useState, useEffect } from "react";
import { Carousel, Pagination } from "react-bootstrap";
import usersUserinfoAxios from "../token/tokenAxios";
import "../css/MyPage.css";
import { useParams, Link } from "react-router-dom";
import Footer from "./Footer";

function MyPage() {
  const [attendingStudy, setAttendingStudy] = useState([]);
  const [myOwnStudy, setMyOwnStudy] = useState([]);
  const [likedStudy, setLikedStudy] = useState([]);

  // 유저 데이터 가져오기
  // 로그인된 유저 = userData
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
        console.log(userData.user_no);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.user_no) {
      const attendingStudies = async () => {
        try {
          const response = await usersUserinfoAxios.get(
            `/attending_studies/${userData.user_no}`
          );
          setAttendingStudy(response.data);

          console.log("response.data[0].user_no : " + response.data[0].user_no);
          console.log("userData.user_no : " + userData.user_no);
        } catch (error) {
          console.log("내가 '신청한' 스터디 목록 가져오기 오류", error);
        }
      };
      attendingStudies();
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.user_no) {
      const myOwnStudies = async () => {
        try {
          const response = await usersUserinfoAxios.get(
            `/my_own_studies/${userData.user_no}`
          );
          setMyOwnStudy(response.data);
        } catch (error) {
          console.log("내가 '작성한' 스터디 목록 가져오기 오류", error);
        }
      };
      myOwnStudies();
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.user_no) {
      const likedStudies = async () => {
        try {
          const response = await usersUserinfoAxios.get(
            `/liked_studies/${userData.user_no}`
          );
          setLikedStudy(response.data);
        } catch (error) {
          console.log("내가 '찜한' 스터디 목록 가져오기 오류", error);
        }
      };
      likedStudies();
    }
  }, [userData]);

  return (
    <div>
      <Header />
      <h1 className="mypage_title_main">My Page {"🍰"}</h1>
      <h2 className="mypage_title">활동중인 스윗 🚀</h2>
      <table className="mypage_table" style={{ fontFamily: "SUITE-Regular" }}>
        <thead>
          <tr>
            <th>게시글 번호</th>
            <th>제목</th>
            <th>시작일</th>
            <th>활동기간</th>
            <th>방장</th>
          </tr>
        </thead>
        <tbody>
          {attendingStudy &&
            attendingStudy.map((study) => (
              <tr key={study.post_no} onClick={(e) => e.stopPropagation()}>
                <td>{study.post_no}</td>
                <td>
                  <Link
                    to={`/study_room/${study.post_no}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Link Clicked");
                    }}
                  >
                    {study.study_title}
                  </Link>
                </td>
                <td>{new Date(study.study_start).toLocaleDateString()}</td>
                <td>{study.study_period}</td>
                <td>{study.nickname}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h2 className="mypage_title">내가 작성한 스윗 ✏️</h2>
      <table className="mypage_table" style={{ fontFamily: "SUITE-Regular" }}>
        <thead>
          <tr>
            <th>게시글 번호</th>
            <th>제목</th>
            <th>시작일</th>
            <th>활동기간</th>
            <th>방장</th>
          </tr>
        </thead>
        <tbody>
          {myOwnStudy &&
            myOwnStudy.map((study) => (
              <tr key={study.post_no} onClick={(e) => e.stopPropagation()}>
                <td>{study.post_no}</td>
                <td>
                  <Link
                    to={`/post_detail/${study.post_no}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Link Clicked");
                    }}
                  >
                    {study.study_title}
                  </Link>
                </td>
                <td>{new Date(study.study_start).toLocaleDateString()}</td>
                <td>{study.study_period}</td>
                <td>{study.nickname}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h2 className="mypage_title">내가 찜한 스윗 💚</h2>
      <table className="mypage_table" style={{ fontFamily: "SUITE-Regular" }}>
        <thead>
          <tr>
            <th>게시글 번호</th>
            <th>제목</th>
            <th>시작일</th>
            <th>활동기간</th>
            <th>방장</th>
          </tr>
        </thead>
        <tbody>
          {likedStudy &&
            likedStudy.map((study) => (
              <tr key={study.post_no} onClick={(e) => e.stopPropagation()}>
                <td>{study.post_no}</td>
                <td>
                  <Link
                    to={`/post_detail/${study.post_no}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Link Clicked");
                    }}
                  >
                    {study.study_title}
                  </Link>
                </td>
                <td>{new Date(study.study_start).toLocaleDateString()}</td>
                <td>{study.study_period}</td>
                <td>{study.nickname}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default MyPage;
