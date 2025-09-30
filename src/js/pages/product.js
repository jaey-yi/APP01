/*
  1. 도서추가기능 
  - **요구사항** :
    + 도서명과 가격을 입력 후 / "확인" 버튼 클릭 으로/ 도서를 추가한다. 
    + 도서명과 가격을 입력 후 .  엔터키 입력 으로 / 도서를 추가한다. 
    + 예외상황 단, 입력값이 누락되었을 경우 추가되지 않는다.
    + 도서 추가가 완료되면 입력 필드는 초기화한다.
    + 도서 추가 완료 시 도서의 갯수를 카운팅하여 화면에 표현한다.

  2.도서 수정기능
  - **요구사항** :
    - 도서 정보의 "수정" 버튼 클릭시 / 모달 창이 뜬다
    - 모달 창이 열리면 / 수정할 도서의 기존 도서명과 가격이 미리 입력되어있다.
    - 모달창에 신규 도서명,가격을 입력 받고 / 저장버튼 클릭시 / 도서명과 가격을 수정한다.
    

  3.도서 삭제 기능
  - **요구사항** :
    - 도서 정보의 "삭제" 버튼 클릭시 브라우저에 제공되는 confirm 창을 띄운다.
    - 해당 confirm 창에서 "확인" 버튼이 클릭되면 / 사용자의 삭제 의사를 확인한 뒤 삭제를 진행한다.
    - 도서 삭제 완료 시 도서의 갯수를 카운팅 하여 화면에 표현한다.

*/

const $ = (selector) => document.querySelector(selector);

function Product() {
  //1.엔터키 입력 또는 확인버튼 클릭시 (form submit) 시 입력된 도서정보 가져오기
  $("#book-regist-form").addEventListener("submit", (e) => {
    e.preventDefault(); //기본이벤트 방지

    const bookName = $("#book-name-input").value;
    const bookprice = Number($("#book-price-input").value);

    if (!bookName.trim() || !bookprice) {
      alert("값을 다시 입력해 주세요.");
      return;
    }

    const bookItem = `
    <li class="book-item">
    <div class="book-info">
    <span class="book-name">${bookName}</span>
    <span class="book-price">₩${bookprice.toLocaleString()}</span>
    </div>
    <div class="book-actions">
    <button class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
    <button class="delete-btn">삭제</button>
    </div>
    </li>
    `;

    $("#book-list").insertAdjacentHTML("beforeend", bookItem);

    $("#book-regist-form").reset(); //입력완료 후 입력폼초기화
    $("#book-name-input").focus(); // 입력완료 후 책이름 포커스

    $("#book-count").innerText = $("#book-list").children.length;
  });
  //2.도서 수정 기능
  $("#book-list").addEventListener("click", (e) => {
    //클릭이벤트가 발생한 요소(이벤트대상)가 수정버튼일때만
    if (e.target.classList.contains("edit-btn")) {
      const $bookItem = e.target.closest(".book-item");
      const bookName = $bookItem.querySelector(".book-name").innerText;
      const bookPrice = Number(
        $bookItem.querySelector(".book-price").innerText.replace(/[₩,]/g, "")
      ); //₩500,000 원 에서 원화 , 표시 없애기
      $("#edit-book-name").value = bookName;
      $("#edit-book-price").value = bookPrice;
    }
  });
}

const product = new Product();
