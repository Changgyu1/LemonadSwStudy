import { useState, useEffect } from 'react';
import '../../css/MainPageCss.css';
import './css/Moment.css';
import { useParams } from 'react-router-dom';
import usersUserinfoAxios from '../../token/tokenAxios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
const Moment = () => {
  const { post_no } = useParams();
  const [userData, setUserData] = useState('');
  const [showButton, setShowButton] = useState(false); // user_no가 일치하면, x버튼이 보임

  const [selectedMomentKey, setSelectedMomentKey] = useState(null);
  const [moment, setMoment] = useState({
    post_no: '',
    user_no: '',
    moment_no: '',
    nickname: '',
    moment_picture: '',
    moment_title: '',
  });
  useEffect(() => {
    const fetchUserData = async () => {
      // 토큰이 없으면 함수 실행 중단
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get('/users/userinfo');
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
        console.log('값을 못불러와요', error);
        setMoment([]);
      }
    };
    fetchMoment();
  }, []);

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  };

  const chunkedMoments = chunkArray(selMoment, 3);

  return (
    <div className="carousel-inner">
      <Carousel interval={null}>
        {chunkedMoments.map((chunk, moment) => (
          <Carousel.Item key={moment.moment_no} className="M_item">
            {chunk.map((moment) => (
              <div key={moment.moment_no} className="carousel-moment">
                <div className="Moment_item">
                  <div className="study_schedule">
                    <p className="">작성일</p>
                    <p>{moment.moment_post_date}</p>

                    <p>작성자 : </p>
                    <p>{moment.nickname}</p>
                  </div>
                  <h1 className="board_title">{moment.moment_title}</h1>
                  <div className="board_content_border"></div>
                  <section className="board_info_section">
                    <div>
                      <img
                        className="user_profile_img_set"
                        width="200px"
                        height="200px"
                        src={`data:image/jpeg;base64,${moment.moment_picture}`}
                        alt="Profile"
                      />
                    </div>
                    <div className="board_info_right">
                      <div className="comment_count_section">
                        <button>X</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
export default Moment;
