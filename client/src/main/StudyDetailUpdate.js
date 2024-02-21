import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/StudyDetail.css";
import "../css/NewBoard.css";
import usersUserinfoAxios from "../token/tokenAxios";
import axios from "axios";
import StuduyProject from "./StudyProject";
import MentoMenti from "./MentoMenti";

function StudyDetailUpdate() {
  const { post_no } = useParams();

  const navigate = useNavigate();

  const [StudyDetailUpdate, setStudyDetailUpdate] = useState([]);

  const [selectedItem1, setSelectedItem1] = useState(null);

  const handleItem1Click = (item1) => {
    if (selectedItem1 === item1) {
      // 클릭된 아이템이 현재 선택된 아이템과 같으면 선택 해제
      setSelectedItem1(null);
    } else {
      // 아니면 새로운 아이템 선택
      setSelectedItem1(item1);
    }
  };

  const [detailPages, setDetailPage] = useState([]);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/post_detail/${post_no}`
        );
        setDetailPage(response.data);
        console.log(detailPages);
        console.log(post_no.study_title);
      } catch (error) {
        console.log("Error fetching study detail: ", error);
      }
    };

    fetchStudyDetail();
  }, [post_no]); // post_no가 변경될 때마다 실행

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudyDetail((prevStudyDetail) => ({
      ...prevStudyDetail,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersUserinfoAxios.put(`/update/${post_no}`, studyDetail);
      alert("스터디 정보가 수정되었습니다.");
      // Redirect to the updated study detail page or any other page
      navigate(`/post_detail/${post_no}`);
    } catch (error) {
      console.log("Error updating study detail: ", error);
    }
  };

  const [studyDetail, setStudyDetail] = useState({
    study_title: "",
    study_content: "",
    nickname: "",
    recruit_type: "",
    study_method: "",
    study_start: "",
    study_period: "",
    recruit_deadline: "",
    study_location: "",
    skill: "",
  });

  return (
    <div>
      <Header />

      <h1 className="title">S.With 수정하기</h1>
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
            <StuduyProject />
          ) : null}
          {selectedItem1 === "멘토/멘티" ? <MentoMenti /> : null}
        </section>
      </div>
      <button
        className="commentInput_buttonComplete"
        onClick={handleFormSubmit()}
      >
        수정하기
      </button>
    </div>
  );
}

export default StudyDetailUpdate;
