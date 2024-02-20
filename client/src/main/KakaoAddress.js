import "bootstrap/dist/css/bootstrap.min.css";

function sample6_execDaumPostcode({ setNewUser }) {
  new window.daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      var addr =
        data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

      // 도로명 주소에서 법정동명이 있을 경우 추가한다.
      if (
        data.userSelectedType === "R" &&
        data.bname !== "" &&
        /[동|로|가|길|읍|면|리]$/g.test(data.bname)
      ) {
        // 여기에서 data.jibunAddress를 사용하도록 수정
        addr =
          data.jibunAddress ||
          `${data.sigungu} ${data.bname} ${data.jibunAddress}`;
      }

      // 주소 정보를 해당 필드에 넣는다.
      document.getElementById("useraddress").value = addr;
      setNewUser((prevUser) => ({ ...prevUser, useraddress: addr }));
    },
  }).open();
}

export default sample6_execDaumPostcode;
