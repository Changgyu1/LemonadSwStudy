import { useEffect, useState } from "react";
import axios from "axios";
import usersUserinfoAxios from "../../token/tokenAxios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MomentModal() {
  const { post_no } = useParams();
  const [moment, setMoment] = useState({
    post_no: `${post_no}`,
    user_no: "",
    moment_no: "",
    moment_title: "",
    img: "",
  });
  const [showModal, setShow] = useState(false); //show Modal
  const [userData, setUserData] = useState("");
  const handleClose = () => setShow(false); //모달창 열고닫는 핸들러
  const handleShow = () => setShow(true);

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
          // setNotice의 user_no에 받아온 userNo 값을 넣어줌
          ...prevUserData,
          user_no: userNo,
        }));
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);
  const handleInputChange = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;
    setMoment((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await usersUserinfoAxios.post(
        `/studyRoom/create/StudyMoment/${post_no}`,
        moment,
        {
          withCredentials: true,
        }
      );
      console.log(userData.user_no);
      console.log(moment.post_no);

      setMoment(response.data);
    } catch (error) {
      console.error("데이터 저장 불가", error);
    }
    setShow(false);
  };
  //s.with moment
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택한 파일
    const reader = new FileReader();

    reader.onloadend = () => {
      setMoment((prevUser) => ({ ...prevUser, img: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <Button className="add_moment_btn" onClick={handleShow}>
        S.with Moment +
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <input
              type="hidden"
              name="post_no"
              value={post_no}
              onChange={handleInputChange}
            />
            <input
              type="hidden"
              name="user_no"
              value={userData.user_no}
              onChange={handleInputChange}
            />
            <div className="moment_box_title_small">S.with Moment 제목 : </div>
            <input
              type="text"
              name="moment_title"
              value={moment.moment_title}
              onChange={handleInputChange}
              required
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="moment_img_content"> S.with Moment : </div>
          <input
            className="image_input"
            type="file"
            name="img"
            onChange={(e) => handleImageChange(e)}
            required
          />
          {/* 프로필 사진 미리보기를 위한 이미지 컨테이너 */}
          <div className="moment-profile-image-container">
            {moment.img && (
              <img
                width="250px"
                height="250px"
                src={moment.img}
                alt="s.with moment"
                className="moment_profile_image"
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="."
            variant="secondary"
            onClick={(e) => {
              handleSave(e);
              // 페이지 새로고침
              window.location.reload();
            }}
          >
            저장
          </Button>
          <Button
            className="btn_close"
            variant="secondary"
            onClick={handleClose}
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default MomentModal;
