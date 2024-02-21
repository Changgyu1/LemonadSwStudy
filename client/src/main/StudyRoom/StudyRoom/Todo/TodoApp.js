import React, { useState } from 'react';
import Template from './Template';
import TodoList from './TodoList';
import TodoInsert from './TodoInsert';
import { useParams } from 'react-router-dom';
import { MdAddCircle } from 'react-icons/md';
import axios from 'axios';

let nextId = 4;

const TodoApp = () => {
  const { post_no } = useParams();
  const [insertToggle, setInsertToggle] = useState(false);
  const [todos, setTodos] = useState([
    {
      post_no: '',
      id: '',
      todo_description: '',
      checked: false,
      todo_date: '',
    },
  ]);

  const onInsertToggle = () => {
    setInsertToggle((prev) => !prev);
  };

  const onInsertTodo = async (e, todo_description, todo_date) => {
    e.preventDefault();

    if (todo_description === '') {
      return alert('할 일을 입력해주세요.');
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/studyRoom/create/Todo/${post_no}`,
        {
          todo_description: todo_description,
          checked: false,
          todo_date: todo_date,
        },
        {
          withCredentials: true,
        }
      );

      const newTodo = {
        id: nextId,
        todo_description,
        todo_date,
        checked: false,
      };

      setTodos((todos) => [...todos, newTodo]);
      nextId++;

      alert('저장 성공');
      window.location.reload();
    } catch (error) {
      console.error('저장 실패', error);
    }
  };

  const onCheckToggle = (id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  return (
    <div>
      <Template todoLength={todos.length}>
        <TodoList todos={todos} onCheckToggle={onCheckToggle} />
        <div className="add-todo-button" onClick={onInsertToggle}>
          <MdAddCircle />
        </div>
        {insertToggle && (
          <TodoInsert
            onInsertToggle={onInsertToggle}
            onInsertTodo={onInsertTodo}
          />
        )}
      </Template>
    </div>
  );
};

export default TodoApp;
