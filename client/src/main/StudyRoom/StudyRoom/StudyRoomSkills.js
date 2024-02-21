//스터디 룸의 스킬 불러오자..!
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import usersUserinfoAxios from '../../token/tokenAxios';
import './css/Notice.css';
const StudyRoomSkills = () => {
  const { post_no } = useParams(); //동적 라우트 매개변수 가져오기
  const [swithUser, setSwithUser] = useState('');

  const [detailPages, setDetailPage] = useState([]);
  useEffect(() => {
    const fetchStudyDetail = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/post_detail/${post_no}`
        );
        setDetailPage(response.data);
        console.log(detailPages);
      } catch (error) {
        console.log('Error fetching study detail: ', error);
      }
    };

    fetchStudyDetail();
  }, [post_no]); // post_no가 변경될 때마다 실행

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
    <div className="studyRoom_skills">
      <li className="studyContent_contentWrapper">
        <span className="studyInfo_title">기술스택</span>
        <span className="studyInfo_title_a">
          {uniqueSkills &&
            uniqueSkills.map((skill, index) => <li key={index}>{skill}</li>)}
        </span>
      </li>
    </div>
  );
};
export default StudyRoomSkills;
