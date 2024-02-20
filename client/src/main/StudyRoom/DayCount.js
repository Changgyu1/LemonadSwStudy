//시작일로부터 1일이 지날때마다 +1된다.
//가능하다면, 스터디룸 시작일 기준으로 d-day - +해보기
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usersUserinfoAxios from "../../token/tokenAxios";
import "./css/Notice.css";
const DayCount = () => {
  const { post_no } = useParams(); // 동적 라우트 매개변수 가져오기

  const [DayCount, setDayCount] = useState([]);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/post_detail/${post_no}`
        );
        setDayCount(response.data);
        setDetailPage(response.data);
        console.log(DayCount);
      } catch (error) {
        console.log("Error fetching study detail: ", error);
      }
    };

    fetchStudyDetail();
  }, [post_no]); // post_no가 변경될 때마다 실행

  const startDay = new Date(DayCount.study_start); //스터디 시작일
  const today = new Date(); //오늘
  const dDay = today - startDay;
  const days = Math.floor(dDay / (1000 * 60 * 60 * 24));
  ///////////////////////////////////////////////////////////////////
  const [detailPages, setDetailPage] = useState([]);
  const [swithUser, setSwithUser] = useState("");
  // 이미지 정보를 가져오기 위해 만들어줌
  useEffect(() => {
    // detailPages.user_no를 사용하여 요청을 보내도록 수정
    if (detailPages && detailPages.user_no) {
      const fetchStudyDetailUserNo = async () => {
        try {
          const response = await usersUserinfoAxios.get(
            `/users/info/${detailPages.user_no}`
          );
          setSwithUser(response.data);
        } catch (error) {}
      };

      fetchStudyDetailUserNo();
    }
  }, [detailPages]);
  // studyPostWithSkills에 대한 중복제거 조건문 추가
  const uniqueSkills = detailPages.studyPostWithSkills && [
    ...new Set(
      detailPages.studyPostWithSkills.map((skill) => skill.skill_name)
    ),
  ];
  return (
    <div className="DayCount_div_all">
      <span className="DayCount_startDay">
        S.with 시작일 : {DayCount.study_start}
      </span>
      <span className="DayCount">
        {"    "}
        {days === 0 ? "D-DAY" : days < 0 ? `D${days}` : `D+${days}`}
      </span>
      <br />
      <span className="DayCount_startDay">
        기술스택 :
        {uniqueSkills &&
          uniqueSkills.map((skill, index) => (
            <li
              key={index}
              style={{
                display: "inline-block",
                marginLeft: "10px",
                color: "#161414",
              }}
            >
              {skill}
            </li>
          ))}
      </span>
    </div>
  );
};
export default DayCount;
