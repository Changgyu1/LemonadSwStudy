import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import "../css/StudyDetail.css";
import "../css/NewBoard.css";
import usersUserinfoAxios from "../token/tokenAxios";
import axios from "axios";
import StudyApplication from "./StudyApplication";
import StudyDetail from "./StudyDetail";
import Modal from "react-modal";

function StudyDetailUpdate() {
  const { post_no } = useParams(); // 동적 라우트 매개변수 가져오기
  const [detailPages, setDetailPage] = useState({
    study_status: "", // 초기값으로 빈 문자열 설정
    max_study_applicants: "",
    // 나머지 데이터도 추가
    // // FormFour에서 온 데이터
    recruit_type: "",
    study_title: "",
    study_content: "",
    // StudyProject에서 온 데이터
    study_method: "",
    study_period: "",

    study_location: "",
    // first_study: "",
    study_start: "",
    recruit_deadline: "",
  });
  const [formFourData, setFormFourData] = useState({
    studyTitle: "",
    studyContent: "",
  });
  // StudyProject에서 사용하는 상태들을 초기화
  const [studyMethod, setStudyMethod] = useState("");

  const [duration, setDuration] = useState(detailPages.study_period);
  const [techStack, setTechStack] = useState(""); // 보류
  const [deadline, setDeadline] = useState(detailPages.recruit_deadline);
  const [region, setRegion] = useState(detailPages.study_location);
  const [study_place, setStudy_place] = useState(detailPages.study_start);
  const [studyStatus, setStudyStatus] = useState("O");
  const [studyLikes, setStudyLikes] = useState("1");
  const [studyLocation, setStudyLocation] = useState("1");
  const [firstStudy, setFirstStudy] = useState("1");
  const [mentorCount, setMentorCount] = useState("");
  const [menteeCount, setMenteeCount] = useState("");
  const [applicationCount, setApplicationCount] = useState(
    detailPages.max_study_applicants
  );
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [studyTitle, setStudyTitle] = useState("");
  const [studyContent, setStudyContent] = useState("");

  // const [updateData, setUpdateData] = useState({
  //   max_study_applicants: "",
  //   study_period: "",
  //   skills: "",
  //   recruit_deadline: "",
  //   study_location: "",
  //   first_study: "",
  //   study_method: "",
  //   study_title: "",
  //   study_content: "",
  //   study_start: "",
  // });

  // 게시글 쓴 유저 = swithUser
  const [swithUser, setSwithUser] = useState("");

  // 유저 데이터 가져오기
  // 로그인된 유저 = userData
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
        // setUserNo(response.data.user_no); // user_no를 상태에 저장
        console.log("userData.user_role", userData.user_role);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);
  const [application, setApplication] = useState([]);
  useEffect(() => {
    const fetchStudyDetail = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/update/${post_no}`,

          {
            withCredentials: true,
          }
        );

        setEditStudy_period(response.data.study_period);
        setEditStudy_content(response.data.study_content);
        setEditStudy_title(response.data.study_title);
        setMax_study_applicants(
          response.data.studyApplication.max_study_applicants
        );
        setEditStudy_method(response.data.study_method);
        setEditRecruit_deadline(response.data.recruit_deadline);
        setEditStudy_start(response.data.study_start);
        setEditStudy_location(response.data.study_location);
        setEditRecruit_type(response.data.recruit_type);
        setEditFirst_study(response.data.first_study);

        setDetailPage(response.data);

        const studyPostTime = response.data.study_post_time;
        setApplication(response.data.studyApplication);
        console.log("detailPages : ", response.data);
        console.log(response.data.comments);
      } catch (error) {
        console.log("Error fetching study detail: ", error);
      }
    };

    fetchStudyDetail();
  }, [post_no]); // post_no가 변경될 때마다 실행

  // 예시용 값 안맞으니깐 보고 직접 다시 바꾸셔요
  const handlePostUpdate = async (e) => {
    const handleEditChange = (e) => {
      // setEditStudy_period(e.target.value);
      setEditStudy_title(e.target.value);
      setEditStudy_content(e.target.value);
      // setMax_study_applicants(e.target.value);
      // setEditRecruit_deadline(e.target.value);
      // setEditStudy_start(e.target.value);
      // setEditStudy_location(e.target.value);
      // setEditStudy_method(e.target.value);
      // setEditRecruit_type(e.target.value);
    };

    try {
      // 게시물 수정 요청 보내기
      const response = await usersUserinfoAxios.patch(
        `/update/${post_no}`,
        {
          study_title: editStudy_title,
          study_content: editStudy_content,
          max_study_applicants: editMax_study_applicants,
          study_method: editStudy_method,
          recruit_deadline: editRecruit_deadline,
          study_start: editStudy_start,
          study_period: editStudy_period,
          study_location: editStudy_location,
          recruit_type: editRecruit_type,
          first_study: editFirst_study,
        },
        {
          withCredentials: true,
        }
      );
      // setUpdateData(response.data);
      // setUpdateData((updateData) => [...updateData, response.data]);
      // // window.location.reload();
      // console.log("updateData : ", updateData);
      console.log("게시물 수정 완료:", response.data);
    } catch (error) {
      console.error("게시물 수정 실패:", error);
    }
  };

  const [uniqueSkills, setUniqueSkills] = useState([]);
  // studyPostWithSkills에 대한 중복제거 조건문 추가
  const getuniqueSkills = detailPages.studyPostWithSkills && [
    ...new Set(
      detailPages.studyPostWithSkills.map((skill) => skill.skill_name)
    ),
  ];

  //////////////////////////////////////////////////////////
  const [editStudy_period, setEditStudy_period] = useState();
  const [editStudy_title, setEditStudy_title] = useState();
  const [editStudy_content, setEditStudy_content] = useState();
  const [editMax_study_applicants, setMax_study_applicants] = useState();
  const [editStudy_method, setEditStudy_method] = useState();
  const [editRecruit_deadline, setEditRecruit_deadline] = useState();
  const [editStudy_start, setEditStudy_start] = useState();
  const [editStudy_location, setEditStudy_location] = useState();
  const [editRecruit_type, setEditRecruit_type] = useState();
  const [editFirst_study, setEditFirst_study] = useState();

  console.log("detailPages.study_period: " + detailPages.study_period);

  //////////////////////////////////////////////////////////////////

  const customStyles = {
    content: {
      width: "50%", // 모달의 가로 크기를 조절합니다.
      height: "50%", // 모달의 세로 크기를 조절합니다.
      margin: "auto", // 화면 중앙에 모달을 배치합니다.
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [cafes, setCafes] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleButtonClick = () => {
    if (!isModalOpen) {
      openModal();
    } else {
      closeModal();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await usersUserinfoAxios.get(
        `/KeywordCafes?keyword=${keyword}`
      );
      setCafes(response.data);
    } catch (error) {
      console.error("Error searching cafes:", error);
    }
  };

  const handleItemClick = (cafe) => {
    setKeyword(cafe.bplcnm);
    setStudy_place(cafe.sitewhladdr);
    setEditFirst_study(cafe.sitewhladdr);
    closeModal();
  };

  return (
    <div>
      <div>
        <input
          defaultValue={editStudy_title}
          onChange={(e) => setEditStudy_title}
        ></input>
      </div>
      <section>
        <div className="application_totalWrapper">
          <div className="application_totalWrapper_2">
            <div className="application_totalWrapper_3"></div>
          </div>
        </div>
        <ul className="studyContent_grid">
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">모집구분</span>
            <span className="studyInfo_title_a">
              <select
                name="recruit_type"
                defaultValue={editRecruit_type}
                onChange={(e) => setEditRecruit_type}
              >
                <option value="스터디">스터디</option>
                <option value="프로젝트">프로젝트</option>
              </select>
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">진행방식</span>
            <span className="studyInfo_title_a">
              <select name="recruit_type" defaultValue={editStudy_method}>
                <option value="온라인">온라인</option>
                <option value="오프라인">오프라인</option>
                <option value="온/오프라인">온/오프라인</option>
              </select>
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">모집인원</span>
            <span className="studyInfo_title_a">
              <input
                type="number"
                name="max_study_applicants"
                defaultValue={editMax_study_applicants}
                onChange={(e) => setMax_study_applicants}
              />
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">시작예정일</span>
            <span className="studyInfo_title_a">
              <input
                type="date"
                name="study_start"
                defaultValue={editStudy_start} // [study, setStudy] -> value에는 study
                //                    onChange에는 setStudy로
                onChange={(e) => setEditStudy_start}
              />
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">예상기간</span>
            <span className="studyInfo_title_a">
              <input
                type="text"
                defaultValue={editStudy_period}
                onChange={(e) => setEditStudy_period(e.target.value)}
              />
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">모집마감</span>
            <span className="studyInfo_title_a">
              <input
                type="date"
                name="recruit_deadline"
                defaultValue={editRecruit_deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </span>
          </li>
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">지역</span>
            <span className="studyInfo_title_a">
              <select
                defaultValue={editStudy_location}
                onChange={(e) => setEditStudy_location(e.target.value)}
              >
                <option value="0" style={{ display: "none" }}></option>
                <option value="강남/역삼/삼성">강남/역삼/삼성</option>
                <option value="신사/청담/압구정">신사/청담/압구정</option>
                <option value="서초/교대/사당">서초/교대/사당</option>
                <option value="잠실/송파/강동">잠실/송파/강동</option>
                <option value="을지로/명동/중구/동대문">
                  을지로/명동/중구/동대문
                </option>
                <option value="서울역/이태원/용산">서울역/이태원/용산</option>
                <option value="종로/인사동">종로/인사동</option>
                <option value="홍대/합정/마포/서대문">
                  홍대/합정/마포/서대문
                </option>
                <option value="여의도">여의도</option>
                <option value="구로/신도림/금천">구로/신도림/금천</option>
                <option value="건대입구/성수/왕십리">
                  건대입구/성수/왕십리
                </option>
                <option value="성북/강북/노원/도봉">성북/강북/노원/도봉</option>
                <option value="기타">기타</option>
              </select>
            </span>
          </li>
          {editStudy_method === "오프라인" ||
          editStudy_method === "온/오프병행" ? (
            <li className="studyContent_contentWrapper">
              <span className="studyInfo_title">첫모임장소</span>

              <div className="cafeModal">
                <input
                  type="text"
                  defaultValue={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="cafeSearchInput"
                  placeholder={editFirst_study}
                  required
                />
                <button
                  onClick={() => {
                    handleButtonClick();
                    handleSearch();
                  }}
                >
                  Search
                </button>
                <div>
                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                  >
                    <button
                      onClick={() => {
                        closeModal();
                      }}
                      id="modalCloseBtn"
                    >
                      ✖
                    </button>
                    <ul>
                      {cafes.map((cafe) => (
                        <li
                          key={cafe.id}
                          onClick={() => handleItemClick(cafe)}
                          className="cafe_p"
                        >
                          <p className="cafe_p">
                            {cafe.bplcnm} ( {cafe.sitewhladdr} )
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Modal>
                </div>
              </div>
            </li>
          ) : null}
          <li className="studyContent_contentWrapper">
            <span className="studyInfo_title">기술스택</span>
            <span className="studyInfo_title_a">
              <input
                type="text"
                value={getuniqueSkills ? getuniqueSkills.join(", ") : ""}
                onChange={(e) => {
                  // 입력된 값을 배열로 분할하여 uniqueSkills 상태에 설정
                  setUniqueSkills(e.target.value.split(", "));
                }}
              />
            </span>
          </li>
        </ul>
      </section>

      <div className="postContent_wrapper">
        <p className="postInfo"></p>
        <p className="postContent">
          <input
            defaultValue={editStudy_content}
            onChange={(e) => setEditStudy_content(e.target.value)}
          ></input>
        </p>
      </div>

      <button onClick={handlePostUpdate}>게시물 수정</button>
    </div>
  );
}

export default StudyDetailUpdate;
