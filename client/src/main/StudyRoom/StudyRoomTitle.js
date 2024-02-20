import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usersUserinfoAxios from "../../token/tokenAxios";
import axios from "axios";
import "../../css/StudyRoomTitle.css";
import EditImg from "../img/editButton.png";
const StudyRoomTitle = () => {
  const { post_no } = useParams();

  const [userData, setUserData] = useState("");
  const [showInput, setShowInput] = useState(false); //수정하기 버튼 누르면 input

  const [studyRoomTitle, setStudyRoomTitle] = useState({
    //가져오고 업데이트 해줄 곳
    post_no: "",
    user_no: "",
    study_title: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await usersUserinfoAxios.get("/users/userinfo");
        const userNo = response.data.user_no;

        setUserData((prevUserData) => ({
          ...prevUserData,
          user_no: userNo,
        }));

        // studyRoomTitle 상태에도 user_no를 설정
        setStudyRoomTitle((prevStudyRoomTitle) => ({
          ...prevStudyRoomTitle,
          user_no: userNo,
        }));
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchStudyRoomTitle = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/studyRoom/create/Title/${post_no}`
        );
        const userNo = response.data.user_no;
        setStudyRoomTitle((prevUserData) => ({
          ...prevUserData,
          user_no: userNo, // user_no를 설정해줘야 합니다.
          study_title: response.data.study_title, // study_title도 설정해줘야 합니다.
        }));
      } catch (error) {
        console.log("값을 못불러와요", error);
      }
    };
    fetchStudyRoomTitle();
  }, [post_no]);

  const handleInputChange = (e) => {
    setStudyRoomTitle({ ...studyRoomTitle, study_title: e.target.value });
  };

  const handleUpdateTitle = async (e) => {
    e.preventDefault();
    try {
      const response = await usersUserinfoAxios.post(
        `/studyRoom/update/Title/${post_no}`,
        studyRoomTitle, // studyRoomTitle을 직접 전달
        {
          params: {
            post_no: post_no, // post_no는 URL 파라미터로 전달
            user_no: studyRoomTitle.user_no, // user_no는 URL 파라미터로 전달
            study_title: studyRoomTitle.study_title,
          },
          withCredentials: true,
        }
      );
      console.log("서버 응답:", response.data);
      setStudyRoomTitle({
        ...studyRoomTitle,
        study_title: response.data.study_title,
      });
      window.location.reload();
      console.log("사용자 프로필 업데이트 성공");
    } catch (error) {
      console.error("업데이트 불가", error);
    }
  };
  return (
    <div>
      <div className="StudyRoomTitle">{studyRoomTitle.study_title}</div>
      <div>
        {showInput ? (
          <>
            <input
              className="room_title_input"
              type="text"
              name="study_title"
              value={studyRoomTitle.study_title}
              onChange={handleInputChange}
            />
            <button
              className="room_title_button"
              onClick={(e) => {
                handleUpdateTitle(e);
                setShowInput(false);
              }}
            >
              <img
                src={EditImg}
                alt="edit"
                style={{ width: "30px", height: "30px" }}
              />
            </button>
          </>
        ) : (
          <button
            className="StudyRoomTitle_first_button"
            onClick={() => {
              setShowInput((prevShowInput) => !prevShowInput);
            }}
            style={{
              display:
                showInput ||
                (userData.user_no !== studyRoomTitle.user_no && !showInput)
                  ? "none"
                  : "block",
            }}
          >
            <p>
              수정
              <img
                src={EditImg}
                alt="edit"
                style={{
                  width: "13px",
                  height: "13px",
                  marginBottom: "4px",
                  marginLeft: "4px",
                }}
              />
            </p>
          </button>
        )}
      </div>
    </div>
  );
};
export default StudyRoomTitle;
