import usersUserinfoAxios from "../token/tokenAxios";
import { useState, useEffect } from "react";
import "../css/Header.css";
import { Link } from "react-router-dom";
import DeleteIcon from "./img/delete.png";

export default function AlarmModal({ userNo, closeModal }) {
  const [alarmUser, setAlarmUser] = useState("");
  const [alarmData, setAlarmData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await usersUserinfoAxios.get(`/users/info/${userNo}`);
        setAlarmUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data.", error);
      }
    };

    const fetchAlarmData = async () => {
      try {
        const response = await usersUserinfoAxios.get(`/alarm_List/${userNo}`);
        setAlarmData(response.data);
      } catch (error) {
        console.error("Failed to fetch Alarm Data", error);
      }
    };

    if (userNo) {
      fetchUserData(userNo);
    }

    fetchAlarmData(); // 여기로 이동
  }, [userNo]);

  const deleteAlarm = async (alarm_no) => {
    try {
      // 서버로의 POST 요청 데이터 확인
      const response = await usersUserinfoAxios.post(
        `/alarmDelete/${alarm_no}`
      );
      console.log("알림 삭제 완료!");

      // 서버 응답에서 더 많은 정보 확인
      console.log("Server Response:", response);

      // 다시 렌더링
      const updatedAlarms = await usersUserinfoAxios.get(
        `/alarm_List/${userNo}`
      );
      setAlarmData(updatedAlarms.data);
    } catch (error) {
      console.error("Failed to Alarm data", error);

      // 서버 응답에서 더 많은 정보 확인
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  const handleAlarmDelete = (alarm_no) => {
    // alarm_no 값이 정상적으로 전달되는지 확인
    console.log("Deleting alarm:", alarm_no);
    deleteAlarm(alarm_no);
  };

  return (
    <section className="vh-100">
      <div className="container py-1 h-100">
        <div className="row d-flex justify-content-center align-items-center h-10">
          <p className="alarm_title">🔔 알림함 🔔</p>
          <ul>
            {Array.isArray(alarmData) &&
              alarmData.map((data) => (
                <li key={data.alarm_no}>
                  <Link
                    to={`/post_detail/${data.post_no}`}
                    className="alarm_link"
                  >
                    <div className="alarm_content_div">
                      <p
                        style={{ whiteSpace: "pre-wrap" }}
                        className="alarm_date"
                      >
                        {new Date(data.timestamp).toLocaleDateString()}
                        {"  "}
                      </p>
                      <p
                        style={{ whiteSpace: "pre-wrap" }}
                        className="alarm_message"
                      >
                        {data.alarm_message}
                      </p>

                      <img
                        src={DeleteIcon}
                        className="delete_img_alarm"
                        alt="deleteButton"
                        onClick={(e) => {
                          handleAlarmDelete(data.alarm_no);
                          e.preventDefault(); // 기본 동작 막기 (링크 이동 방지)
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
