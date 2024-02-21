//시작일로부터 1일이 지날때마다 +1된다.
//가능하다면, 스터디룸 시작일 기준으로 d-day - +해보기
import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import usersUserinfoAxios from '../../token/tokenAxios';
import './css/Notice.css';
const DayCount = () => {
  const { post_no } = useParams(); // 동적 라우트 매개변수 가져오기

  const [DayCount, setDayCount] = useState([]);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      try {
        const response = await usersUserinfoAxios.get(
          `/post_detail/${post_no}`
        );
        setDayCount(response.data);
        console.log(DayCount);
      } catch (error) {
        console.log('Error fetching study detail: ', error);
      }
    };

    fetchStudyDetail();
  }, [post_no]); // post_no가 변경될 때마다 실행
  const startDay = new Date(DayCount.study_start); //스터디 시작일
  const today = new Date(); //오늘
  const dDay = today - startDay;
  const days = Math.floor(dDay / (1000 * 60 * 60 * 24));
  return (
    <div>
      <span className="DayCount_startDay">
        s.with 시작일 : {DayCount.study_start}
      </span>
      <span className="DayCount">
        {' '}
        {days === 0 ? 'D-DAY' : days < 0 ? `D${days}` : `D+${days}`}
      </span>
    </div>
  );
};
export default DayCount;
