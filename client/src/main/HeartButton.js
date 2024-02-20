import React, { useState, useEffect } from "react";
import usersUserinfoAxios from "../token/tokenAxios";
import HeartImg from "./img/yesheart.png";
import EmptyHeartImg from "./img/noheart.png";

const HeartButton = ({ like, onClick }) => {
  return (
    <img
      src={like ? HeartImg : EmptyHeartImg}
      onClick={onClick}
      alt="Heart"
      style={{ width: "25px", height: "25px", marginLeft: "140px" }}
    />
  );
};

export default HeartButton;
