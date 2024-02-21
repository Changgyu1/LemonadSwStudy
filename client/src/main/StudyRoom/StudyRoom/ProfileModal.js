import '../css/Profile.css';
import usersUserinfoAxios from '../token/tokenAxios';
import { useState, useEffect } from 'react';

export default function ProfileModal({ onClick, userNo }) {
  const [profileUser, setProfileUser] = useState('');
  const [swithHistory, setSwithHistory] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await usersUserinfoAxios.get(`/users/info/${userNo}`);
      setProfileUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data.', error);
    }
  };

  useEffect(() => {
    if (userNo) {
      fetchSwithHistory(userNo);
      fetchUserData(userNo);
    }
  }, [userNo]);

  const fetchSwithHistory = async (user_no) => {
    try {
      const response = await usersUserinfoAxios.get(
        `/attending_studies/${user_no}`
      );

      if (Array.isArray(response.data)) {
        setSwithHistory(response.data);
      } else {
        console.error(
          'FetchSwithHistory: Data is not an array.',
          response.data
        );
      }

      console.log('swithHistory: ', swithHistory);
    } catch (error) {
      console.error('Failed to fetchSwithHistory.', error);
    }
  };

  if (!profileUser) {
    return null;
  }

  return (
    <section className="vh-100">
      <div className="container py-1 h-100">
        <div className="row d-flex justify-content-center align-items-center h-10">
          <div className="">
            <div style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-3">
                  <img
                    className="profile_image"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                    }}
                    src={`data:image/jpeg;base64,${profileUser.user_profile}`}
                    alt="profile_image"
                  />
                </div>
                <p className="mb-2 swith_title" style={{ fontSize: '27px' }}>
                  {profileUser.nickname}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="swith_detail">
          <div className="mt-4">
            <h4 style={{ fontSize: '27px' }} className="swith_title">
              S.With Me
            </h4>
            <p style={{ fontSize: '14px' }}>{profileUser.user_introduction}</p>
          </div>
          <div className="mt-4">
            <h4 style={{ fontSize: '27px' }} className="swith_title">
              S.With History
            </h4>
            <p style={{ fontSize: '14px' }}>
              {swithHistory.map((history) => (
                <li key={history.study_no}>{history.study_title}</li>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
