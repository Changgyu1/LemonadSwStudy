//참가현황
//유저프로필 - 해당 게시글의 승낙, 거절 기능
//디테일 페이지에 신청버튼 만들어서 연결
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/StudyDetail.css";
import Accept from "./img/accept.png";
import Reject from "./img/reject.png";
import usersUserinfoAxios from "../token/tokenAxios";

export default function StudyApplication({
  userData,
  user_no,
  applicationKey,
  swithUser,
}) {
  const { post_no } = useParams(); // 동적 라우트 매개변수 가져오기

  const [adminUser, setAdminUser] = useState(false);

  const [applicantData, setApplicantData] = useState([]);

  const fetchApplicantData = async () => {
    try {
      const response = await usersUserinfoAxios.get(
        `/application_update/${post_no}`
      );
      setApplicantData(response.data);
      console.log("user_no: " + user_no);
      console.log("userData.user_no: " + userData.user_no);
      if (swithUser.user_no === userData.user_no) {
        setAdminUser(true);
      } else {
        setAdminUser(false);
      }

      console.log("보이니", response.data);
    } catch (error) {
      console.error("Failed applicant 데이터 가져오기 실패", error);
    }
  };

  useEffect(() => {
    fetchApplicantData();

    console.log("게시글작성자스윗유저: " + swithUser.user_no);
    console.log("로그인유저: " + userData.user_no);
    if (swithUser.user_no === userData.user_no) {
      setAdminUser(true);
    } else {
      setAdminUser(false);
    }
  }, [post_no, applicationKey]);

  const handleAccept = async (accept, user_no) => {
    try {
      const action = accept ? "accept" : "reject";
      await usersUserinfoAxios.post(
        `/application_update/${post_no}/${user_no}?action=${action}`
      );
      // 성공적으로 요청이 완료되면 데이터를 다시 가져옴
      fetchApplicantData();
    } catch (error) {
      console.error(`Failed to ${accept ? "accept" : "reject"} user`, error);
    }
  };

  console.log("adminUser: " + adminUser);

  return (
    <div className="studyApplication">
      <p className="studyApplication_title">
        {applicantData.length > 0 &&
          applicantData[0].accepted_applicants &&
          applicantData[0].max_study_applicants &&
          `S.With 신청 현황 (${applicantData[0].accepted_applicants}/${applicantData[0].max_study_applicants})`}
      </p>
      <div className="studyApplaction_user">
        {applicantData &&
          applicantData.map((users, index) => (
            <li
              key={index}
              className="studyApplaction_user_li"
              style={{ whiteSpace: "nowrap" }}
            >
              <div className="studyApplaction_user_p">
                {users.nickname}
                <div>
                  {adminUser && users.status !== "승인" && (
                    <div className="register_swithButton">
                      <button
                        name="accept"
                        onClick={() => handleAccept(true, users.user_no)}
                      >
                        <img
                          className="accept_img"
                          src={Accept}
                          alt="accepr_img"
                        />
                      </button>
                      <button
                        name="reject"
                        onClick={() => handleAccept(false, users.user_no)}
                      >
                        {" "}
                        <img
                          className="reject_img"
                          src={Reject}
                          alt="reject_img"
                        />
                      </button>
                    </div>
                  )}
                  {users.user_no === userData.user_no &&
                    users.status !== "승인" && (
                      <div>
                        <button
                          style={{
                            backgroundColor: "#8ee3ff",
                            width: "80px",
                            height: "27px",
                            borderRadius: "50px",
                          }}
                          name="reject"
                          onClick={() => handleAccept(false, users.user_no)}
                        >
                          <p style={{}}>취소하기</p>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </li>
          ))}
      </div>
    </div>
  );
}
