import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/NewBoard.css";
import StudyProject from "./StudyProject";
import FormFour from "./FormFour";
import MentoMenti from "./MentoMenti";
import usersUserinfoAxios from "../token/tokenAxios";
import Footer from "./Footer";

function NewBoard() {
  // FormFour에서 사용하는 상태들을 초기화
  const [studyTitle, setStudyTitle] = useState(""); // 추가
  const [studyContent, setStudyContent] = useState(""); // 추가
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

  const handleDataFromChild = (data) => {
    // 자식 컴포넌트에서 받은 데이터 처리
    console.log("Data from child component:", data);
    // 여기에서 필요한 로직을 수행
    setStudyMethod(data.studyMethod);
    setApplicationCount(data.applicationCount);
    setDuration(data.duration);
    setTechStack(data.techStack);
    setDeadline(data.deadline);
    setRegion(data.region);
    setStudy_place(data.study_place);
    setStudyLocation(data.studyLocation);
    setStartDate(data.startDate);

    // FormFour 컴포넌트에서 받은 데이터도 처리
    setFormFourData({
      studyTitle: data.studyTitle,
      studyContent: data.studyContent,
    });

    console.log("제목1: " + formFourData.studyTitle);
    console.log("제목2: " + studyTitle);

    // StudyProject에서 받은 데이터 처리
    setStudyTitle(data.studyTitle);
    setStudyContent(data.studyContent);
  };

  const [board, setBoard] = useState([]);
  const [formFourData, setFormFourData] = useState({
    studyTitle: "",
    studyContent: "",
  });
  // StudyProject에서 사용하는 상태들을 초기화
  const [studyMethod, setStudyMethod] = useState("");

  const [duration, setDuration] = useState("");
  const [techStack, setTechStack] = useState("");
  const [deadline, setDeadline] = useState("");
  const [region, setRegion] = useState("1");
  const [study_place, setStudy_place] = useState("1");
  const [studyStatus, setStudyStatus] = useState("O");
  const [studyLikes, setStudyLikes] = useState("1");
  const [studyLocation, setStudyLocation] = useState("1");
  const [firstStudy, setFirstStudy] = useState("1");
  const [mentorCount, setMentorCount] = useState("");
  const [menteeCount, setMenteeCount] = useState("");
  const [applicationCount, setApplicationCount] = useState();
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [startDate, setStartDate] = useState("");

  // 게시물을 생성하는 함수
  // 게시물 생성 함수를 의존성 배열 밖으로 빼서 코드를 간소화
  const createPost = async () => {
    console.log("studyMethod:", studyMethod);
    try {
      const response = await usersUserinfoAxios.post(
        "/create",
        {
          study_status: studyStatus,
          mentor_count: mentorCount,
          mentee_count: menteeCount,
          max_study_applicants: applicationCount,
          // 나머지 데이터도 추가
          // FormFour에서 온 데이터
          recruit_type: selectedItem1,
          study_title: studyTitle,
          study_content: studyContent,
          // StudyProject에서 온 데이터
          study_method: studyMethod,
          study_period: duration,
          skills: techStack,
          recruit_deadline: deadline,
          study_location: region,
          first_study: study_place,
          study_start: startDate,
          // 유저 데이터
          user_no: userData.user_no,
          nickname: userData.nickname,
        },
        { timeout: 10000 }
      );
      // 성공 여부에 따라 다른 알림 표시
      if (response.data === true) {
        alert("두 날짜는 같습니다.");
      } else if (response.data === "success") {
        alert("모집일이 과거의 날짜입니다. 다시 설정해주세요.");
      } else if (response.data === "false1") {
        alert("게시물이 성공적으로 생성되었습니다.");
        console.log("게시물 생성 성공:", response.data);
        setSubmittedData(response.data); // 생성된 게시물 데이터 저장
        navigate("/");
      }
    } catch (error) {
      console.error("게시물 생성 실패:", error);
      console.error("에러 응답 데이터:", error.response?.data);
    }
    console.log("ㅎㅇ" + techStack);
  };

  const navigate = useNavigate();
  // Submit 버튼 클릭 시 게시물 생성
  const handleCreatePost = () => {
    // 여기서 createPost 함수 호출
    createPost();
  };

  const handleItem1Click = (item1) => {
    if (selectedItem1 === item1) {
      // 클릭된 아이템이 현재 선택된 아이템과 같으면 선택 해제
      setSelectedItem1(null);
    } else {
      // 아니면 새로운 아이템 선택
      setSelectedItem1(item1);
    }
  };

  console.log("뉴보드js: " + studyMethod);

  return (
    <div>
      <Header />

      <h1 className="title">새 S.With 작성하기</h1>
      <div className="section_1">
        <section>
          <div className="post_1">
            <span className="post_1_title">1</span>
            <h2 className="post_title">S.With 모집 구분을 골라주세요.</h2>
          </div>

          <ul className="postToggle_ul">
            <li
              className={`postToggle ${
                selectedItem1 === "스터디" ? "clicked" : ""
              }`}
              onClick={() => handleItem1Click("스터디")}
            >
              <span className="postToggle_text">스터디</span>
            </li>

            <li
              className={`postToggle ${
                selectedItem1 === "프로젝트" ? "clicked" : ""
              }`}
              onClick={() => handleItem1Click("프로젝트")}
            >
              <span className="postToggle_text">프로젝트</span>
            </li>

            <li
              className={`postToggle ${
                selectedItem1 === "멘토/멘티" ? "clicked" : ""
              }`}
              onClick={() => handleItem1Click("멘토/멘티")}
            >
              <span className="postToggle_text">멘토/멘티</span>
            </li>
          </ul>
          <br />
          <br />

          {/* Conditionally render StuduyProject based on the selected item */}
          {selectedItem1 === "스터디" || selectedItem1 === "프로젝트" ? (
            <StudyProject
              handleDataFromChild={handleDataFromChild}
              setStudyMethod={setStudyMethod}
              setApplicationCount={setApplicationCount}
              setDuration={setDuration}
              setTechStack={setTechStack}
              setDeadline={setDeadline}
              setRegion={setRegion}
              setStudy_place={setStudy_place}
              setStudyTitle={setStudyTitle}
              setStudyContent={setStudyContent}
              setStartDate={setStartDate}
            />
          ) : null}
          {selectedItem1 === "멘토/멘티" ? (
            <MentoMenti onDataChanged={handleDataFromChild} />
          ) : null}
        </section>
      </div>
      {/* 추가: Submit 버튼 */}
      <button onClick={handleCreatePost} className="buttonComplete">
        게시물 생성
      </button>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default NewBoard;
