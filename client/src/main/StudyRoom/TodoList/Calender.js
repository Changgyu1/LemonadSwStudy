import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; //npm i react-calendar,
import "react-calendar/dist/Calendar.css"; // css import
import moment from "moment"; // npm i moment
import { useParams } from "react-router-dom";
import "./Calender.css";
import axios from "axios";
function ReactCalendar() {
  const { post_no } = useParams();
  const [value, onChange] = useState(new Date()); //내가 선택하는 날짜
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가
  const [todo, setTodo] = useState([]); // TodoList를 가져올 데이터, 배열로 설정해준다.
  const [showInput, setShowInput] = useState(false); //+ 버튼 누르면 보여줄 비밀번호 input창
  useEffect(() => {
    // 선택된 날짜가 변경될 때 TodoList 데이터를 불러옴
    if (selectedDate) {
      // Todo 데이터를 불러오는 로직 (axios 등을 사용)
      fetchTodoList(selectedDate);
      console.log(selectedDate);
    }
  }, [selectedDate]);

  //insert
  const handleInsert = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/studyRoom/create/Todo/${post_no}`, {
        withCredentials: true,
      });
      console.log(todo.post_no);
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;
    setTodo((prevUser) => ({ ...prevUser, [name]: value }));
  };

  //const

  //select
  const fetchTodoList = async (todo_date) => {
    try {
      // TODO: 서버에서 해당 날짜의 TodoList를 가져오는 API 호출
      const response = await axios.get(
        `http://lemonadswith.store:8080/studyRoom/get/Todo/${post_no}/${todo_date}`
      );

      // 가져온 데이터를 TodoList 상태에 업데이트
      setTodo(response.data); //값을 넣어줌
      console.log(response.data);
    } catch (error) {
      console.error("TodoList를 불러오는데 실패했습니다.", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Calendar
        onChange={(todo_date) => {
          onChange(todo_date);
          setSelectedDate(moment(todo_date).format("YYYY-MM-DD"));
        }}
        formatDay={(locale, todo_date) => moment(todo_date).format("DD")}
        value={value}
        className="mx-auto w-full text-sm border-b"
      />{" "}
      <div style={{ marginRight: "10%", width: "50%" }}>
        <h2 style={{ fontFamily: "SejonghospitalBold", fontSize: "30px" }}>
          {moment(value).format("YYYY년 MM월 DD일")} 할 일
        </h2>
        {/* TodoList 컴포넌트를 렌더링하고 선택된 날짜에 해당하는 할 일 목록을 전달 */}
        <div>
          <table className="calender_table">
            <thead>
              <tr>
                <th>할일 목록</th>
              </tr>
            </thead>
            <tbody>
              {todo.length > 0 ? (
                todo.map((todo) => (
                  <tr key={todo.value}>
                    <td>{todo.todo_list}</td>
                    <td>
                      <button>수정</button>
                    </td>
                    <td>
                      <button>삭제</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Todo List</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="todo_add_button"
            onClick={() => setShowInput((prevShowInput) => !prevShowInput)}
            style={{
              display: showInput ? "none" : "block",
            }}
          >
            +Todo
          </button>
          {showInput ? (
            <div>
              <input
                className="todo_input"
                type="text"
                name="todo_list"
                onChange={handleInputChange}
              />
              <button
                className="todo_cancel_button"
                onClick={() => setShowInput(false)}
              >
                취소
              </button>
              <button className="todo_submit_button" onClick={handleInsert}>
                작성
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ReactCalendar;
