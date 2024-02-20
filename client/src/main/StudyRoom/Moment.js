import { useState, useEffect } from "react";
import "../../css/MainPageCss.css";
import "../../css/Moment.css";
import { useParams } from "react-router-dom";
import usersUserinfoAxios from "../../token/tokenAxios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Pagination } from "react-bootstrap";
const Moment = () => {
  const { post_no } = useParams();
  const [userData, setUserData] = useState("");
  const [showButton, setShowButton] = useState(false); // user_no가 일치하면, x버튼이 보임

  const [selectedMomentKey, setSelectedMomentKey] = useState(null);
  const [moment, setMoment] = useState({
    post_no: "",
    user_no: "",
    moment_no: "",
    nickname: "",
    moment_picture: "",
    moment_title: "",
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
        setMoment((prevUserData) => ({
          // setMoment의 user_no에 받아온 userNo 값을 넣어줌
          ...prevUserData,
          user_no: userNo,
        }));
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
        setMoment([]);
      }
    };
    fetchUserData();
  }, []);

  //select
  const [selMoment, setSelMoment] = useState([]);
  useEffect(() => {
    const fetchMoment = async () => {
      // 토큰이 없으면 함수 실행 중단
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get(
          `/studyRoom/select/StudyMoment/${post_no}`
        );
        //,notice,
        setSelMoment(response.data);
        console.log(response.data);
        //{
        //withCredentials: true,
        //}
        //);
        //console.log(response.data);
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
        console.log("값을 못불러와요", error);
        setMoment([]);
      }
    };
    fetchMoment();
  }, []);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const pageSize = 8; // 페이지당 아이템 수

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  };

  const chunkedMoments = chunkArray(selMoment, pageSize);
  const currentData = chunkedMoments[currentPage - 1] || [];

  const handleDeleteMoment = async (e, selectedMoment) => {
    e.preventDefault();
    console.log("Delete button clicked");
    try {
      //서버로 삭제할 데이터 보내기
      const response = await usersUserinfoAxios.post(
        `/studyRoom/delete/StudyMoment/${post_no}`,
        { ...moment, moment_no: selectedMoment.moment_no },
        // 삭제 전송
        {
          withCredentials: true,
        }
      );
      alert("삭제 성공");
      window.location.reload();
    } catch (error) {
      console.error("삭제 불가", error);
    }
  };

  return (
    <div>
      <h2 className="moment_box_title">S.With Moment 📷</h2>
      <div className="moment-container">
        {currentData.map((moment, index) => (
          <div key={index} className="moment-moment">
            <div className="Moment_item">
              <div className="moment_content">
                <p className="">작성일</p>
                <p>{moment.moment_post_date}</p>
                <p>작성자 : </p>
                <p>{moment.nickname}</p>
                {userData.user_no === moment.user_no && (
                  <button
                    onClick={(e) => {
                      handleDeleteMoment(e, moment);
                    }}
                    className="moment_btn"
                  >
                    ✖
                  </button>
                )}
              </div>
              <div className="board_content_border"></div>
              <section className="moment_info_section">
                <div>
                  <img
                    className="moment-profile-image-container"
                    width="250px"
                    height="250px"
                    src={`data:image/jpeg;base64,${moment.moment_picture}`}
                    alt="Profile"
                  />
                  <h1 className="moment_title">{moment.moment_title}</h1>
                </div>
                <div className="board_info_right">
                  <div className="comment_count_section"></div>
                </div>
              </section>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <Pagination className="pagination-container">
          {[...Array(Math.ceil(selMoment.length / pageSize))].map(
            (_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
    </div>
  );
};

export default Moment;
