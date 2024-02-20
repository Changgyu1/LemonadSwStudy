import React, { useState } from 'react';
import { MdAddCircle } from 'react-icons/md';

const TodoInsert = ({ onInsertToggle, onInsertTodo }) => {
  const [value, setValue] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onInsertTodo(e, value); // 전체 이벤트와 값 모두를 onInsertTodo에 전달
    setValue('');
    onInsertToggle();
  };

  const onClickInside = (e) => {
    if (e.target.tagName !== 'INPUT') {
      onInsertToggle();
    }
  };

  return (
    <div>
      <div className="background" onClick={onClickInside}>
        <form>
          <input placeholder="입력하세요" value={value} onChange={onChange} />
          <button type="submit" onClick={onSubmit}>
            <MdAddCircle />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoInsert;
