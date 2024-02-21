import React, { useState, useEffect } from "react";
import usersUserinfoAxios from "../token/tokenAxios";
import Header from "./Header";
import axios from "axios";
import sample6_execDaumPostcode from "./KakaoAddress";
import { useNavigate } from "react-router-dom";
import { logout, isTokenAvailable } from "../token/tokenAxios";
const UpdateUser = () => {
  //주소값

  const [confirmNickname, setConfirmNickname] = useState(""); //nickname 중복확인
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const [userData, setNewUser] = useState({
    email: "",
    password: "",
    nickname: "",
    user_profile: "",
    img: "",
    useraddress: "",
    user_introduction: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setNewUser(response.data); // 로그인한 토큰 이용해서 해당 유저 데이터 가져오는거
        console.log(userData);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };

    fetchUserData();
  }, []);

  //profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      //서버로 업데이트할 데이터 보내기
      const response = await usersUserinfoAxios.post(
        "http://localhost:8080/users/updateUserProfile",
        userData,
        // 업데이트할 필드만 전송
        {
          withCredentials: true,
        }
      );
      // profile 업데이트가 성공하면 서버에서 응답된 데이터를 받아와서 userData를 업데이트
      setNewUser(response.data);
      setNewUser((prevUser) => [...prevUser, response.data]);
      window.location.reload();
      console.log("사용자 프로필 업데이트 성공");
    } catch (error) {
      console.error("수정 불가", error);
    }
  };
  //profile img

  const handleImageChange = (e) => {
    const files = e.target.files;
    // Check if any file is selected
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser((prevUser) => ({ ...prevUser, img: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected
      setNewUser((prevUser) => ({ ...prevUser, img: null }));
    }
  };
  useEffect(() => {}, [userData.img]);

  const handleInputChange = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;

    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      //서버로 업데이트할 데이터 보내기
      const response = await usersUserinfoAxios.post(
        "http://localhost:8080/users/updateUser",
        userData,
        // 업데이트할 필드만 전송

        {
          withCredentials: true,
        }
      );
      // 업데이트가 성공하면 서버에서 응답된 데이터를 받아와서 userData를 업데이트
      setNewUser(response.data);
      setNewUser((prevUser) => [...prevUser, response.data]);
      window.location.reload();
      console.log("사용자 데이터 업데이트 성공");
    } catch (error) {
      console.error("수정 불가", error);
    }
  };

  //닉네임 중복 확인 및 길이 제약
  const handleNickname = async (e) => {
    e.preventDefault();
    const { nickname } = userData;
    const maxLength = 10;
    if (nickname.length > maxLength) {
      alert(`닉네임은 ${maxLength}자 이하로 입력해주세요.`);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/users/nickname",
        userData,
        {
          withCredentials: true,
        }
      );

      setConfirmNickname(response.data.toString());
      if (response.data !== "existsNick") {
        alert("사용 가능한 닉네임입니다.");
        setConfirmNickname("new");
      } else if (response.data === "existsNick") {
        alert("이미 존재하는 닉네임입니다.");
        setConfirmNickname("existsNick");
      }
    } catch (error) {
      console.error("닉네임이 부적합합니다.", error);
    }
  };
  //password
  const handleInputChange1 = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;

    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  //password update button
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (isButtonDisabled === true && userData.password === confirmPassword) {
      try {
        //서버로 업데이트할 데이터 보내기
        const response = await usersUserinfoAxios.post(
          "http://localhost:8080/users/updatePassword",
          userData, //수정된 사용자 데이터 보내기
          {
            withCredentials: true,
          }
        );
        // 업데이트가 성공하면 서버에서 응답된 데이터를 받아와서 userData를 업데이트
        console.log("사용자 데이터 업데이트 성공");
        alert("비밀번호 수정이 완료되었습니다.");
      } catch (error) {
        console.error("수정 불가", error);
      }
    } else {
      alert("모든 인증을 확인해주세요");
    }
  };
  //password constraint
  const handleConfirmPassword = async (e) => {
    console.log("swithUser.password", userData.password);
    console.log("confirmPassword", confirmPassword);
    const passwordRegex =
      /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;
    if (userData.password === confirmPassword) {
      // Check if the password meets the regex pattern
      if (passwordRegex.test(confirmPassword)) {
        alert("비밀번호가 일치하며 조건에 부합합니다.");
        setIsButtonDisabled(true);
      } else {
        alert("비밀번호가 일치하지만 조건에 부합하지 않습니다.");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  //delete
  const handleDelete = async (e) => {
    e.preventDefault();
    const isConfirmedDelete = window.confirm("탈퇴하시겠습니까?");
    if (isConfirmedDelete) {
      try {
        //서버로 삭제할 데이터 보내기
        const response = await usersUserinfoAxios.post(
          "http://localhost:8080/users/deleteUser",
          userData,
          // 삭제 전송
          {
            withCredentials: true,
          }
        );
        const responseLikes = await usersUserinfoAxios.post(
          "http://localhost:8080/users/deleteLikes",
          userData,
          {
            withCredentials: true,
          }
        );
        const responseApplication = await usersUserinfoAxios.post(
          "http://localhost:8080/users/deleteApplication",
          userData,
          {
            withCredentials: true,
          }
        );
        console.log("사용자 삭제 성공"); //사용자 삭제후,
        if (isTokenAvailable() !== null) {
          //로그아웃 후 메인페이지로
          localStorage.removeItem("token");
          navigate("/");
          window.location.reload();
        } else {
          // 로그아웃이 실패했을 때의 추가 작업
          console.error("로그아웃 실패");
        }
      } catch (error) {
        console.error("삭제 불가", error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div>
        <h4>프로필 수정하기</h4>
        <div>
          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">프로필 사진(profile image)</h4>
            </div>
            <label className="m-2"></label>
            <input
              className="image_input"
              type="file"
              accept="image/*" // 이미지 파일만 선택할 수 있도록 지정
              name="img"
              onChange={(e) => handleImageChange(e)}
            />
            {/* 프로필 사진 미리보기를 위한 이미지 컨테이너 */}
            <div className="profile-image-container">
              {userData.img === null ? (
                <img
                  src={userData.img}
                  style={{
                    width: "200px",
                    height: "200px",
                    margin: "10px",
                    marginTop: "20px",
                    marginBottom: "10px",
                    borderRadius: "30px",
                  }}
                  alt="기존 프로필"
                  className="profile-image"
                />
              ) : (
                <img
                  src={`data:image/jpeg;base64,${userData.user_profile}`}
                  style={{
                    width: "200px",
                    height: "200px",
                    margin: "10px",
                    marginTop: "20px",
                    marginBottom: "10px",
                    borderRadius: "30px",
                  }}
                  alt="변경할 프로필"
                  className="profile-image"
                />
              )}
            </div>
            <br />
            <button
              onClick={handleUpdateProfile}
              type="button"
              name="login"
              className="btn round"
              style={{
                backgroundColor: "#75ddff",
                width: "200px",
                height: "50px",
                margin: "10px",
                marginTop: "20px",
                marginBottom: "10px",
                borderRadius: "30px",
              }}
            >
              프로필 수정
            </button>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <h4>기본 정보 수정하기</h4>
      <br />
      <div className="two">
        <h4 className="s_text">닉네임(nick name)</h4>
      </div>

      <div>
        <input
          type="text"
          name="nickname"
          value={userData.nickname}
          onChange={handleInputChange}
        />
        <button
          onClick={handleNickname}
          className="btn round"
          style={{
            backgroundColor: "#ffffb5",
            width: "100px",
            height: "50px",
            margin: "10px",
            marginTop: "5px",
            borderRadius: "30px",
          }}
        >
          닉네임 중복확인
        </button>
      </div>

      <div className="two">
        <h4 className="s_text">주소(address)</h4>
      </div>
      <div>
        <input type="text" id="useraddress" />
        <input
          name="useraddress"
          className="btn round"
          style={{
            backgroundColor: "#ffffb5",
            width: "150px",
            height: "50px",
            margin: "10px",
            marginTop: "5px",
            borderRadius: "30px",
          }}
          type="button"
          value="주소 찾기"
          onClick={() => sample6_execDaumPostcode({ setNewUser })}
        />
      </div>
      <div className="two">
        <h4 className="s_text">자기소개(self introduction)</h4>
      </div>
      <div>
        <input
          type="text"
          name="user_introduction"
          value={userData.user_introduction}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={handleUpdateUser}
        type="button"
        name="login"
        className="btn round"
        style={{
          backgroundColor: "#75ddff",
          width: "200px",
          height: "50px",
          margin: "10px",
          marginTop: "20px",
          marginBottom: "10px",
          borderRadius: "30px",
        }}
      >
        수정
      </button>
      <br />
      <br />
      <br />
      <br />
      <div>
        <h4>비밀번호 수정하기 </h4>
        <a>영문자,숫자,특수문자를 포함한 8자 이상의 비밀번호</a>
        <br />
        <input
          className="textInput"
          type="password"
          name="password"
          value={userData.password}
          autoComplete="off"
          onChange={handleInputChange1}
        />
        <br />
        <input
          className="textInput"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          autoComplete="off"
          onChange={handlePasswordChange}
        />
        <button
          disabled={isButtonDisabled}
          onClick={handleConfirmPassword}
          className="btn round"
          style={{
            backgroundColor: "#ffffb5",
            width: "100px",
            height: "50px",
            margin: "10px",
            marginTop: "5px",
            borderRadius: "30px",
          }}
        >
          비밀번호 일치확인
        </button>
        <br />
        <button
          onClick={handleUpdatePassword}
          type="button"
          name="login"
          className="btn round"
          style={{
            backgroundColor: "#75ddff",
            width: "200px",
            height: "50px",
            margin: "10px",
            marginTop: "20px",
            marginBottom: "10px",
            borderRadius: "30px",
          }}
        >
          비밀번호 수정
        </button>
        <br />
        <br />
        <br />
        <br />
        <button onClick={handleDelete}>회원 탈퇴하기</button>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default UpdateUser;
