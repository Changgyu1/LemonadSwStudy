import axios from "axios";
import Header from "./Header";
import React, { useState, useEffect } from "react";
import { Carousel, Pagination } from "react-bootstrap";
import usersUserinfoAxios from "../token/tokenAxios";
import "../css/MyPage.css";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import PrevArrow from "./img/prev-arrow.png";
import NextArrow from "./img/next-arrow.png";

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

  /////카루셀//////////
  const settings = {
    dots: true, // 캐러셀 밑에 ... 을 표시할지
    infinite: true, // 슬라이드가 끝까지 가면 다시 처음으로 반복
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 자동 재생 속도
    slidesToShow: 3, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1,
    nextArrow: <NextTo></NextTo>,
    prevArrow: <Pre></Pre>,
  };

  //참여중인 스윗
  const slides_1 =
    attendingStudy &&
    attendingStudy.map((study) => (
      <div key={study.post_no} onClick={(e) => e.stopPropagation()}>
        <div>
          <Link
            className="mypage_box"
            to={`/post_detail/${study.post_no}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Link Clicked");
            }}
          >
            <li>
              {/* <p>{board.post_no}</p> */}
              <div className="mypage_study_sort_badge">
                <div className="mypage_study_sort_badge_content">
                  {study.recruit_type}
                </div>
              </div>

              <div>
                <h1 className="mypage_board_title">{study.study_title}</h1>
              </div>
              <ul className="skill_icon_section">
                {study.studyPostWithSkills.map((skill, index) => (
                  <li key={index}>{skill.skill_name}</li>
                ))}
              </ul>
              <div className="board_content_border"></div>
              <section className="board_info_section">
                <div className="board_info_left">
                  <div className="user_profile_img">
                    <img
                      className="user_profile_img_set"
                      width="30px"
                      height="30px"
                      src={`data:image/jpeg;base64,${study.user_profile}`}
                      alt="Profile"
                      onClick={(e) => {
                        e.preventDefault(); // 기본 동작 막기 (링크 이동 방지)
                        e.stopPropagation(); // 이벤트 전파 방지

                        // 클릭한 유저의 user_no를 상태에 저장
                        const clickedUserNo = study.user_no;

                        // 모달 열기 및 user_no 전달
                        // setProfileUserNo(clickedUserNo);
                        // setProfile(!profile);
                      }}
                    />
                  </div>
                  <div>{study.nickname}</div>
                </div>
                <div className="board_info_right">
                  <div className="comment_count_section">
                    <p>댓글아이콘</p>
                    <p>{study.commentCount}</p>
                  </div>
                </div>
              </section>
            </li>
          </Link>
        </div>
      </div>
    ));

  //내가 찜한 스윗
  const slides_2 =
    likedStudy &&
    likedStudy
      // .filter((study) => study.user_no === userData.user_no)
      .map((study, index) => (
        <div key={study.post_no} onClick={(e) => e.stopPropagation()}>
          <div>
            <Link
              className="mypage_box"
              to={`/post_detail/${study.post_no}`}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Link Clicked");
              }}
            >
              <li>
                {/* <p>{board.post_no}</p> */}
                <div className="mypage_study_sort_badge">
                  <div className="mypage_study_sort_badge_content">
                    {study.recruit_type}
                  </div>
                </div>

                <div>
                  <h1 className="mypage_board_title">{study.study_title}</h1>
                </div>
                <ul className="skill_icon_section">
                  {study.studyPostWithSkills.map((skill, index) => (
                    <li key={index}>{skill.skill_name}</li>
                  ))}
                </ul>
                <div className="board_content_border"></div>
                <section className="board_info_section">
                  <div className="board_info_left">
                    <div className="user_profile_img">
                      <img
                        className="user_profile_img_set"
                        width="30px"
                        height="30px"
                        src={`data:image/jpeg;base64,${study.user_profile}`}
                        alt="Profile"
                        onClick={(e) => {
                          e.preventDefault(); // 기본 동작 막기 (링크 이동 방지)
                          e.stopPropagation(); // 이벤트 전파 방지

                          // 클릭한 유저의 user_no를 상태에 저장
                          const clickedUserNo = study.user_no;

                          // 모달 열기 및 user_no 전달
                          // setProfileUserNo(clickedUserNo);
                          // setProfile(!profile);
                        }}
                      />
                    </div>
                    <div>{study.nickname}</div>
                  </div>
                  <div className="board_info_right">
                    <div className="comment_count_section">
                      <p>댓글아이콘</p>
                      <p>{study.commentCount}</p>
                    </div>
                  </div>
                </section>
              </li>
            </Link>
          </div>
        </div>
      ));

  //내가 작성한 스윗
  const slides_3 =
    myOwnStudy &&
    myOwnStudy
      // .filter((study) => study.user_no === userData.user_no)
      .map((study, index) => (
        <div key={study.post_no} onClick={(e) => e.stopPropagation()}>
          <div>
            <Link
              className="mypage_box"
              to={`/post_detail/${study.post_no}`}
              onClick={(e) => {
                e.stopPropagation();
                console.log("Link Clicked");
              }}
            >
              <li>
                {/* <p>{board.post_no}</p> */}
                <div className="mypage_study_sort_badge">
                  <div className="mypage_study_sort_badge_content">
                    {study.recruit_type}
                  </div>
                </div>

                <div>
                  <h1 className="mypage_board_title">{study.study_title}</h1>
                </div>
                <ul className="skill_icon_section">
                  {study.studyPostWithSkills.map((skill, index) => (
                    <li key={index}>{skill.skill_name}</li>
                  ))}
                </ul>
                <div className="board_content_border"></div>
                <section className="board_info_section">
                  <div className="board_info_left">
                    <div className="user_profile_img">
                      <img
                        className="user_profile_img_set"
                        width="30px"
                        height="30px"
                        src={`data:image/jpeg;base64,${study.user_profile}`}
                        alt="Profile"
                        onClick={(e) => {
                          e.preventDefault(); // 기본 동작 막기 (링크 이동 방지)
                          e.stopPropagation(); // 이벤트 전파 방지

                          // 클릭한 유저의 user_no를 상태에 저장
                          const clickedUserNo = study.user_no;

                          // 모달 열기 및 user_no 전달
                          // setProfileUserNo(clickedUserNo);
                          // setProfile(!profile);
                        }}
                      />
                    </div>
                    <div>{study.nickname}</div>
                  </div>
                  <div className="board_info_right">
                    <div className="comment_count_section">
                      <p>댓글아이콘</p>
                      <p>{study.commentCount}</p>
                    </div>
                  </div>
                </section>
              </li>
            </Link>
          </div>
        </div>
      ));

  return (
    <div>
      <Header />

      <div>
        <h1 className="mypage_title">My Page {"🍰"}</h1>
      </div>
      <div>
        <main className="mypage_attendingListMain">
          <div style={{ width: "70%", marginLeft: "10%" }}>
            <p className="mypage_subtitle">활동중인 스윗</p>
          </div>

          <ul className="">
            <StyledSlider {...settings}>{slides_1}</StyledSlider>
          </ul>
          <br />
          <br />
          <br />
          <br />
          <div style={{ width: "70%", marginLeft: "10%" }}>
            <p className="mypage_subtitle">내가 찜한 스윗</p>
          </div>

          <ul className="">
            <StyledSlider {...settings}>{slides_2}</StyledSlider>
          </ul>

          <br />
          <br />
          <br />
          <br />
          <div style={{ width: "70%", marginLeft: "10%" }}>
            <p className="mypage_subtitle">내가 작성한 스윗</p>
          </div>

          <ul className="">
            <StyledSlider {...settings}>{slides_3}</StyledSlider>
          </ul>
        </main>

        <div>
          <ul></ul>
        </div>
      </div>
    </div>
  );
}

export default MyPage;

const StyledSlider = styled(Slider)`
  // Slider 컴포넌트를 꾸며주는 스타일드 컴포넌트 생성
  width: 80%;
  margin: auto;

  position: relative;

  .slick-prev:before,
  .slick-next:before {
    color: #75ddff;
  }

  .slick-next {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translate(0, -50%);
    z-index: 5;
  }

  .slick-prev {
    position: absolute;
    top: 50%;
    left: 15px;
    z-index: 5;
    transform: translate(0, -50%);
  }
`;

const Pre = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  left: 3%;

  z-index: 3;
`;

const NextTo = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 3%;
  z-index: 3;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;
