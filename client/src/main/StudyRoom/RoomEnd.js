import React, { useEffect } from "react";
import usersUserinfoAxios from "../../token/tokenAxios";
const StudyRoomChecker = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // 서버에 종료된 스터디룸 조회 요청 보내기
        await usersUserinfoAxios.get("/studyRoom/RoomEnd");

        // 종료된 스터디룸 처리 로직 구현
        // 예: console.log('종료된 스터디룸을 처리합니다.');
      } catch (error) {
        console.error("Error fetching room status:", error);
      }
    }, 60000); // 1분마다 확인 (1000ms * 60s)

    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌 해제
    return () => clearInterval(interval);
  }, []);
};

export default StudyRoomChecker;
