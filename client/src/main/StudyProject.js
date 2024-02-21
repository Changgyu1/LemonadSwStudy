import React, { useState, useEffect } from "react";
import "../css/NewBoard.css";
import FormFour from "./FormFour";
import usersUserinfoAxios from "../token/tokenAxios";
import axios from "axios";
import Modal from "react-modal";
import DeleteIcon from "./img/delete.png";
import Footer from "./Footer";

const StudyProject = ({ handleDataFromChild }) => {
  // formData에 저장된 데이터 사용

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
    closeModal();
  };
  const [applicationCount, setApplicationCount] = useState();

  const [duration, setDuration] = useState();
  const [techStack, setTechStack] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [region, setRegion] = useState("");
  const [study_place, setStudy_place] = useState("");

  const [studyMethod, setStudyMethod] = useState("");

  const [studyTitle, setStudyTitle] = useState("");
  const [studyContent, setStudyContent] = useState("");

  const [startDate, setStartDate] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const [selectedItem2, setSelectedItem2] = useState(null);

  const handleItem2Click = (item2) => {
    if (selectedItem2 === item2) {
      // 클릭된 아이템이 현재 선택된 아이템과 같으면 선택 해제
      setSelectedItem2(null);
    } else {
      // 아니면 새로운 아이템 선택
      setSelectedItem2(item2);
    }

    // setStudyMethod 함수를 호출한 후에 handleDataChange를 호출하도록 수정
    setStudyMethod(item2);
    handleDataChange();
  };

  const handleTechStackChange = (e) => {
    const selectedTech = e.target.value;

    // 이미 선택된 기술스택이 있는지 확인
    if (techStack.includes(selectedTech)) {
      // 이미 선택된 경우, 해당 기술스택을 배열에서 제거
      setTechStack(techStack.filter((tech) => tech !== selectedTech));
    } else if (techStack.length < 5) {
      // 선택된 기술스택이 5개 미만인 경우에만 추가
      setTechStack([...techStack, selectedTech]);
    } else {
      // 5개를 넘을 경우 알림창 표시
      alert("최대 5개까지만 선택 가능합니다.");
    }
    console.log("기술: " + techStack);
  };

  const handleDeleteTech = (deletedTech) => {
    setTechStack(techStack.filter((tech) => tech !== deletedTech));
  };

  const handleDataChange = () => {
    // techStack을 숫자로 이루어진 배열로 변환
    const techStackAsNumbers = techStack.map((tech) => parseInt(tech));
    // 데이터가 변경될 때마다 부모 컴포넌트로 데이터 전달
    handleDataFromChild({
      studyTitle,
      studyContent,
      studyMethod,
      applicationCount,
      duration,
      techStack: techStackAsNumbers,
      deadline,
      region,
      study_place,
      startDate,
    });
    console.log("기술: " + techStack);
  };

  // 기술스택의 숫자 값과 텍스트를 매핑하는 객체
  const techStackOptions = {
    1: "Angular",
    2: "C",
    3: "C++",
    4: "Django",
    5: "Docker",
    6: "Express",
    7: "Figma",
    8: "Firebase",
    9: "Flask",
    10: "Flutter",
    11: "Git",
    12: "Go",
    13: "GraphQL",
    14: "Java Script",
    15: "Java",
    16: "Kotlin",
    17: "Kubernetes",
    18: "MongoDB",
    19: "mySql",
    20: "NestJS",
    21: "NextJS",
    22: "NodeJS",
    23: "Php",
    24: "Python",
    25: "R",
    26: "React",
    27: "React Native",
    28: "Spring",
    29: "Svelte",
    30: "Swift",
    31: "Type Script",
    32: "Unity",
    33: "Vue",
    34: "Zeplin",
  };

  console.log("스터디프로젝트js: " + studyMethod);

  return (
    <div>
      <div className="post_1">
        <span className="post_1_title">2</span>
        <h2 className="post_title">S.With 진행 방식을 골라주세요.</h2>
      </div>
      <ul className="postToggle_ul">
        <li
          className={`postToggle ${
            selectedItem2 === "온라인" ? "clicked" : ""
          }`}
          onClick={() => {
            handleItem2Click("온라인");
            setStudyMethod("온라인");
          }}
        >
          <span className="postToggle_text">온라인</span>
        </li>
        <li
          className={`postToggle ${
            selectedItem2 === "오프라인" ? "clicked" : ""
          }`}
          onClick={() => {
            handleItem2Click("오프라인");
            setStudyMethod("오프라인");
          }}
        >
          <span className="postToggle_text">오프라인</span>
        </li>
        <li
          className={`postToggle ${
            selectedItem2 === "온/오프병행" ? "clicked" : ""
          }`}
          onClick={() => {
            handleItem2Click("온/오프병행");
            setStudyMethod("온/오프병행");
          }}
        >
          <span className="postToggle_text">온/오프병행</span>
        </li>
      </ul>
      <br />
      <br />
      <div className="post_1">
        <span className="post_1_title">3</span>
        <h2 className="post_title">S.With 기본 정보를 입력해주세요.</h2>
      </div>
      <form onSubmit={handleFormSubmit} className="all_form">
        <div className="all_form_div">
          <label className="post_3_label">
            모집인원 :
            <input
              type="number"
              value={applicationCount}
              onChange={(e) => setApplicationCount(e.target.value)}
              onBlur={handleDataChange}
            />
          </label>

          <label className="post_3_label">
            진행기간 :
            <input
              type="number"
              placeholder="개월수를 입력"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onBlur={handleDataChange}
            />
          </label>

          <div className="post_4_label">
            기술스택 :
            <select
              value={techStack}
              onChange={handleTechStackChange}
              onBlur={handleDataChange}
            >
              <option value="0" style={{ display: "none" }}></option>
              {Object.entries(techStackOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="post_4_label">
            시작일 :
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={handleDataChange}
            />
          </div>

          <label className="stack_box">
            <div className="selected">
              <br />
              {techStack.map((stack, index) => (
                <div className="selected_2" key={index}>
                  <div className="tech-stack-item">
                    {techStackOptions[stack]}
                  </div>

                  <img
                    src={DeleteIcon}
                    className="delete_img"
                    alt="deleteButton"
                    onClick={() => handleDeleteTech(stack)}
                  />
                </div>
              ))}
            </div>
          </label>

          <label className="post_3_label">
            모집마감 :
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              onBlur={handleDataChange}
            />
          </label>
          <label className="post_3_label">
            지역구분 :
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              onBlur={handleDataChange}
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
              <option value="건대입구/성수/왕십리">건대입구/성수/왕십리</option>
              <option value="성북/강북/노원/도봉">성북/강북/노원/도봉</option>
              <option value="기타">기타</option>
            </select>
          </label>
          {selectedItem2 === "오프라인" || selectedItem2 === "온/오프병행" ? (
            <label className="post_3_label">
              첫모임장소 :
              <div className="cafeModal">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="cafeSearchInput"
                  placeholder="카페이름이나 지역을 입력하세요."
                  onBlur={handleDataChange}
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
            </label>
          ) : null}
        </div>
      </form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <div className="post_1">
          <span className="post_1_title">4</span>
          <h2 className="post_title">S.With을 자세히 소개해주세요.</h2>
        </div>
        <div className="studyProject_title">
          <label htmlFor="title" className="titleLabel">
            제목 :
            <input
              type="text"
              id="title"
              name="title"
              placeholder="제목을 입력하세요."
              value={studyTitle}
              onChange={(e) => setStudyTitle(e.target.value)}
              onBlur={handleDataChange}
            />
          </label>
          <br />
          <div className="studyProject_content">
            <label htmlFor="content" className="contentLabel">
              <textarea
                type="text"
                id="content"
                name="content"
                placeholder="내용을 입력하세요."
                value={studyContent}
                onChange={(e) => setStudyContent(e.target.value)}
                onBlur={handleDataChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyProject;
