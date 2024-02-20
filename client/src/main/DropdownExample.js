import React, { useState } from "react";

const DropdownExample = () => {
  // 상태 변수를 사용하여 선택된 값을 추적
  const [selectedValue, setSelectedValue] = useState("");

  // 드롭다운 옵션의 배열
  const options = ["옵션 1", "옵션 2", "옵션 3", "옵션 4"];

  // 옵션을 매핑하여 옵션 요소를 생성
  const dropdownOptions = options.map((option, index) => (
    <option key={index} value={option}>
      {option}
    </option>
  ));

  // 선택된 값이 변경될 때 호출되는 함수
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      {/* 드롭다운 박스 */}
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="" disabled>
          옵션을 선택하세요
        </option>
        {dropdownOptions}
      </select>

      {/* 선택된 값 출력 */}
      <p>선택된 값: {selectedValue}</p>
    </div>
  );
};

export default DropdownExample;
