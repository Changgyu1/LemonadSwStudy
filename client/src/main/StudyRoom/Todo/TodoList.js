import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TodoItem from './TodoItem';
import Calendar from 'react-calendar'; //npm i react-calendar,
const TodoList = ({ todos, onCheckToggle }) => {
  return (
    <div className="TodoList">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} onCheckToggle={onCheckToggle} />
      ))}{' '}
    </div>
  );
};
export default TodoList;
