import React from 'react';

const Template = ({ children, todoLength }) => {
  return (
    <div className="Template">
      <div className="title">오늘의 할 일 ({todoLength}) </div>
      <div>{children}</div>
    </div>
  );
};
export default Template;
