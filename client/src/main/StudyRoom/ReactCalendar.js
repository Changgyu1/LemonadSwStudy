import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; //npm i react-calendar,
import 'react-calendar/dist/Calendar.css'; // css import
import moment from 'moment'; // npm i moment
import TodoList from './Todo/TodoList'; // TodoList import 추가
import axios from 'axios';
function ReactCalendar() {
  const [value, onChange] = useState(new Date());
  const [mark, setMark] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가
  const [todos, setTodos] = useState([]); // TodoList 데이터 상태 추가

  useEffect(() => {
    // 선택된 날짜가 변경될 때 TodoList 데이터를 불러옴
    if (selectedDate) {
      // Todo 데이터를 불러오는 로직 (axios 등을 사용)
      fetchTodoList(selectedDate);
    }
  }, [selectedDate]);

  const fetchTodoList = async (todo_date) => {
    try {
      // TODO: 서버에서 해당 날짜의 TodoList를 가져오는 API 호출
      const response = await axios.get(
        `http://localhost:8080/studyRoom/get/Todo/${todo_date}`
      );

      // 가져온 데이터를 TodoList 상태에 업데이트
      setTodos(response.data);
    } catch (error) {
      console.error('TodoList를 불러오는데 실패했습니다.', error);
    }
  };
  //mark = select
  return (
    <div>
      <Calendar
        onChange={(todo_date) => {
          onChange(todo_date);
          setSelectedDate(moment(todo_date).format('YYYY-MM-DD'));
        }}
        formatDay={(locale, todo_date) => moment(todo_date).format('DD')}
        value={value}
        className="mx-auto w-full text-sm border-b"
        tileContent={({ todo_date, view }) => {
          if (mark.find((x) => x === moment(todo_date).format('YYYY-MM-DD'))) {
            return (
              <>
                <div className="flex justify-center items-center absoluteDiv">
                  <div className="dot"></div>
                </div>
              </>
            );
          }
        }}
      />
      <div className="text-gray-500 mt-4">
        {moment(value).format('YYYY년 MM월 DD일')}
      </div>
      {/* TodoList 컴포넌트를 렌더링하고 선택된 날짜에 해당하는 할 일 목록을 전달 */}
      <TodoList todos={todos} />
    </div>
  );
}
export default ReactCalendar;
