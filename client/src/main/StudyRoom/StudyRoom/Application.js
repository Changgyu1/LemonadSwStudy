import { useState, useEffect } from 'react';
import '../../css/MainPageCss.css';
import { useParams } from 'react-router-dom';
import usersUserinfoAxios from '../../token/tokenAxios';
import 'bootstrap/dist/css/bootstrap.min.css';

import Modal from './Modal';
import ProfileModal from './Modal';
const Application = () => {
  const { post_no } = useParams();
  const [profile, setProfile] = useState(false);
  const [profileUserNo, setProfileUserNo] = useState(null);
  //select
  const [participant, setParticipant] = useState([]);

  const [userData, setUserData] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get('/users/userinfo');
        setUserData(response.data);

        console.log(userData);
      } catch (error) {
        console.error('Failed to fetch user data.', error);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchMoment = async () => {
      // 토큰이 없으면 함수 실행 중단
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get(
          `/studyRoom/Participant/${post_no}`
        );
        //,notice,
        setParticipant(response.data);
        console.log(response.data);
        //{
        //withCredentials: true,
        //}
        //);
        //console.log(response.data);
      } catch (error) {
        //console.error("Failed to fetch user data.", error);
        console.log('값을 못불러와요', error);
      }
    };
    fetchMoment();
  }, []);

  return (
    <div>
      <h4>참가자</h4>
      <ul>
        {Array.isArray(participant) && participant.length > 0 ? (
          participant.map((participant) => (
            <li
              key={participant.post_no}
              style={{ display: 'inline-block', marginRight: '10px' }}
            >
              {' '}
              <div>
                <img
                  className="user_profile_img_set"
                  width="50px"
                  height="50px"
                  src={`data:image/jpeg;base64,${participant.user_profile}`}
                  alt="Profile"
                  onClick={(e) => {
                    e.preventDefault(); // 기본 동작 막기 (링크 이동 방지)
                    e.stopPropagation(); // 이벤트 전파 방지

                    // 클릭한 유저의 user_no를 상태에 저장
                    const clickedUserNo = participant.user_no;

                    // 모달 열기 및 user_no 전달
                    setProfileUserNo(clickedUserNo);
                    setProfile(!profile);
                  }}
                />
                <br />
                <p>{participant.nickname}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No Swith Participants available.</p>
        )}
      </ul>
      {profile && (
        <Modal closeModal={() => setProfile(!profile)}>
          <ProfileModal
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            userNo={profileUserNo}
          />
        </Modal>
      )}
    </div>
  );
};
export default Application;
