import { useState, useEffect } from "react";
import "../../css/MainPageCss.css";
import { useParams } from "react-router-dom";
import usersUserinfoAxios from "../../token/tokenAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Notice.css";
import StudyRoomTitle from "./StudyRoomTitle";
//select
//delete = password이용 해서 삭제

const Notice = () => {
  const { post_no } = useParams();
  const [userData, setUserData] = useState("");
  const [showInput, setShowInput] = useState(false); //x버튼 누르면 보여줄 비밀번호 input창
  const [selectedNoticeKey, setSelectedNoticeKey] = useState(null); // 선택된 공지의 notice_no를 저장
  const [notice, setNotice] = useState({
    post_no: "",
    user_no: "",
    notice_no: "",
    nickname: "",
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
          `/studyRoom/select/StudyNotice/${post_no}`
        );

        setSelNotice(response.data);
        console.log(response.data);
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
    e.preventDefault();

    try {
      //서버로 삭제할 데이터 보내기
      const response = await usersUserinfoAxios.post(
        `/studyRoom/delete/StudyNotice/${post_no}`,
        { ...notice, notice_no: selectedNotice.notice_no },
        // 삭제 전송
        {
          withCredentials: true,
        }
      );
      console.log("Server response:", response.data);
      console.log("passwordMatched:", response.data.passwordMatched);
      if (selectedNotice.notice_password === notice.notice_password) {
        // 비밀번호가 일치하면 페이지 새로고침
        alert("삭제 성공");
        window.location.reload();
      } else {
        // 비밀번호가 일치하지 않으면 알림창 띄우기
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("삭제 불가", error);
    }
  };

  return (
    <div className="notice_part">
      <ul className="notice_box_section">
        {Array.isArray(selNotice) && selNotice.length > 0 ? (
          selNotice.map((selNotice) => (
            <li className="notice_list" key={selNotice.notice_no}>
              {" "}
              {/* selNotice.notice_no 를 key값으로 설정한다 */}
              <div className="notice_writer_info">
                <p className="notice_p">
                  작성일 : {selNotice.notice_post_date}{" "}
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
                  &nbsp;&nbsp;&nbsp;&nbsp;작성자 :{selNotice.nickname}{" "}
                </p>
                <section>
                  <div className="notice_delete">
                    {showInput && selectedNoticeKey === selNotice.notice_no && (
                      <>
                        <input
                          className="notice_password_input"
                          type="password"
                          name="notice_password"
                          maxLength="4"
                          onChange={handleInputChange}
                          placeholder="비밀번호 4자리"
                        />
                        <button
                          className="notice_x_button "
                          onClick={(e) => {
                            handleDeleteNotice(e, selNotice);
                          }}
                        >
                          삭제
                        </button>
                      </>
                    )}
                    {/* 'X' 버튼은 누르면 안보이게 */}
                    <button
                      className="notice_x_button "
                      onClick={() => {
                        setShowInput((prevShowInput) => !prevShowInput);
                        setSelectedNoticeKey(selNotice.notice_no);
                      }}
                      style={{
                        display:
                          showInput && selectedNoticeKey === selNotice.notice_no
                            ? "none"
                            : "block",
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </section>
              </div>
              <h1 className="notice_title">{selNotice.notice_title}</h1>
              <div className="board_content_border"></div>
              <section className="board_info_section">
                <div className="notice_content">{selNotice.notice_content}</div>
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
