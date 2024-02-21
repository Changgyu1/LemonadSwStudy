import { useState, useEffect } from "react";
import "../../css/MainPageCss.css";
import { Route, useParams } from "react-router-dom";
import usersUserinfoAxios from "../../token/tokenAxios";
import NoticeModal from "./NoticeModal";
import "bootstrap/dist/css/bootstrap.min.css";
//select

const Notice = () => {
  const { post_no } = useParams();
  const [userData, setUserData] = useState("");
  const [notice, setNotice] = useState({
    post_no: "",
    user_no: "",
    notice_no: "",
    notice_title: "",
    notice_content: "",
    notice_password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // 토큰이 없으면 함수 실행 중단
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        const userNo = response.data.user_no;
        setUserData((prevUserData) => ({
          ...prevUserData,
          user_no: userNo,
        }));
        setNotice((prevUserData) => ({
          // setNotice의 user_no에 받아온 userNo 값을 넣어줌
          ...prevUserData,
          user_no: userNo,
        }));
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
        setNotice([]);
      }
    };
    fetchUserData();
  }, []);

  //select
  const [selNotice, setSelNotice] = useState([]);
  useEffect(() => {
    const fetchNotice = async () => {
      // 토큰이 없으면 함수 실행 중단
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get(
          `/studyRoom/select/StudyNoticeMoment/${post_no}`
        );
        //,notice,
        setSelNotice(response.data);
        console.log(response.data);
        //{
        //withCredentials: true,
        //}
        //);
        //console.log(response.data);
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
        console.log("값을 못불러와요", error);
        setNotice([]);
      }
    };
    fetchNotice();
  }, []);

  const handleInputChange = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;
    setNotice((prevUser) => ({ ...prevUser, [name]: value }));
  };

  //공지 삭제하기
  const handleDeleteNotice = async (e, selectedNotice) => {
    // (e, selectedNotice) : selectedNotice => 이값은
    e.preventDefault();
    console.log("Deleting notice:", notice);
    try {
      //서버로 삭제할 데이터 보내기
      const response = await usersUserinfoAxios.post(
        `/studyRoom/delete/StudyNoticeMoment/${post_no}`,
        { ...notice, notice_no: selectedNotice.notice_no },
        // 삭제 전송
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log("공지 삭제 성공");
    } catch (error) {
      console.error("삭제 불가", error);
    }
  };

  return (
    <div>
      <p>글을 올립시다.</p>
      <ul className="board_box_section">
        {Array.isArray(selNotice) && selNotice.length > 0 ? (
          selNotice.map((selNotice) => (
            <li key={selNotice.notice_no}>
              {" "}
              {/* selNotice.notice_no 를 key값으로 설정한다 */}
              <div className="study_sort_badge"></div>
              <div className="study_schedule">
                <p className="">작성일</p>
                <p>{selNotice.notice_post_date}</p>
              </div>
              <h1 className="board_title">{selNotice.notice_title}</h1>
              <div className="board_content_border"></div>
              <section className="board_info_section">
                <div>{selNotice.notice_content}</div>
                {/* 프로필 이미지 가져오는건 나중에하자 .. 
                <div className="board_info_left">
                  
                    
                    <div className="user_profile_img">
                      <img
                        className="user_profile_img_set"
                        width="30px"
                        height="30px"
                        src={board.profileImg}
                        alt="Profile"
                      />
          </div>
                  <div>{userData.nickname}</div>
                </div>*/}

                <div className="board_info_right">
                  <div className="comment_count_section">
                    <input
                      type="password"
                      name="notice_password"
                      maxLength="4"
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="notice_no"
                      value={selNotice.notice_no}
                      onChange={handleInputChange}
                    />
                    <button onClick={(e) => handleDeleteNotice(e, selNotice)}>
                      {" "}
                      {/* selNotice */}X
                    </button>
                  </div>
                </div>
              </section>
            </li>
          ))
        ) : (
          <p>No Noticeboards available.</p>
        )}
      </ul>
    </div>
  );
};

export default Notice;