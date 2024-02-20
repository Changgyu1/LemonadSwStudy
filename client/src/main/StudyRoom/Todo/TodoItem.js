import React from 'react';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md'; //npm install react-icons

const TodoItem = ({ todo, onCheckToggle }) => {
  const { id, todo_description, checked, todo_date } = todo;

  return (
    <div className="TodoItem">
      <div className={`content ${checked ? 'checked' : ''}`}>
        {checked ? (
          <MdCheckBox
            onClick={() => {
              onCheckToggle(id);
            }}
          />
        ) : (
          <MdCheckBoxOutlineBlank />
        )}
        <div className="text">{todo_description}</div>
      </div>
    </div>
  );
};
export default TodoItem;
