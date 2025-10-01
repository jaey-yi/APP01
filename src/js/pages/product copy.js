/*
  #1. 도서추가기능 
  - **요구사항** :
    + 도서명과 가격을 입력 후 / "확인" 버튼 클릭 으로/ 도서를 추가한다. 
    + 도서명과 가격을 입력 후 .  엔터키 입력 으로 / 도서를 추가한다. 
    + 예외상황 단, 입력값이 누락되었을 경우 추가되지 않는다.
    + 도서 추가가 완료되면 입력 필드는 초기화한다.
    + 도서 추가 완료 시 도서의 갯수를 카운팅하여 화면에 표현한다.

  #2.도서 수정기능
  - **요구사항** :
    - 도서 정보의 "수정" 버튼 클릭시 / 모달 창이 뜬다
    - 모달 창이 열리면 / 수정할 도서의 기존 도서명과 가격이 미리 입력되어있다.
    - 모달창에 신규 도서명,가격을 입력 받고 / 저장버튼 클릭시 / 도서명과 가격을 수정한다.
    

  #3.도서 삭제 기능
  - **요구사항** :
    - 도서 정보의 "삭제" 버튼 클릭시 브라우저에 제공되는 confirm 창을 띄운다.
    - 해당 confirm 창에서 "확인" 버튼이 클릭되면 / 사용자의 삭제 의사를 확인한 뒤 삭제를 진행한다.
    - 도서 삭제 완료 시 도서의 갯수를 카운팅 하여 화면에 표현한다.

*/

const $ = (selector) => document.querySelector(selector);

function Product() {
  //재사용 함수 : 도서의 갯수 카운팅해서 추력
  const updateBookCount = () => {
    $("#book-count").innerText = $("#book-list").children.length;
  };

  //렌더링 함수, 도서정보 렌더링 //도서 이름 -금액
  const renderBook = () => {
    const bookItem = this.books
      .map((book) => {
        `
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
      })
      .join("");

    $("#book-list").innderHTML = bookItem;
    updateBookCount();
  };

  // 기능용 함수1. 도서 추가 기능
  const registBook = () => {
    const bookName = $("#book-name-input").value;
    const bookprice = Number($("#book-price-input").value);

    if (!bookName.trim() || !bookprice) {
      alert("값을 다시 입력해 주세요.");
      return;
    }

    //로컬스토리지 #1. 도서추가기능
    //1) 도서상태 변경(새로운 도서추가)

    this.books.push({
      title: bookName,
      title: bookprice,
    });
    //2)변경된 도서상태 저장
    store.setlocalStorage("books", this.books);

    //3) 변경된 상태에 맞춰서 요소 렌더링

    $("#book-regist-form").reset(); //입력완료 후 입력폼초기화
    $("#book-name-input").focus(); // 입력완료 후 책이름 포커스
  };

  //기능용 함수2 -1 도서 수정폼에 기존 데이터 출력
  const editBookForm = (e) => {
    const $bookItem = e.target.closest(".book-item");
    const bookName = $bookItem.querySelector(".book-name").innerText;
    const bookPrice = Number(
      $bookItem.querySelector(".book-price").innerText.replace(/[₩,]/g, "")
    ); //₩500,000 원 에서 원화 , 표시 없애기
    const editbookIndex = Array.from($("#book-list").children).indexOf(
      $bookItem
    );
    $("#edit-book-name").value = bookName;
    $("#edit-book-price").value = bookPrice;
    $("#edit-book-index").value = editbookIndex;
  };

  //기능용함수 2.2 도서 수정요청 기능
  const editBook = () => {
    const editBookName = $("#edit-book-name").value;
    const editBookPrice = Number($("#edit-book-price").value);
    // 배열로,     Nodelist              ,bookItem 이 들어간 index번호 찾기
    const editbookIndex = Number($("#edit-book-index").value);
    //#2.도서 수정 기능
    //1) 도서 상태 변경(기존 도서 찾아서 수정)
    this.books[editbookIndex] = {
      title: editBookName,
      price: editBookPrice,
    };
    //2) 변경된 상태 기록
    store.setlocalStorage("books", this.books);

    //3)변경된 상태 기반으로 요소 렌터링
    const bookItem = this.books
      .map((book) => {
        `
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
      })
      .join("");

    $("#book-list").innderHTML = bookItem;
    $("#editModal. modal-close").click();
  };

  //기능용 함수 3 도서삭제
  const deleteBook = (e) => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      //#로컬 1) 도서상태 변경(기존 도서 삭제)
      //도서제거
      const deleteBookIndex = Array.from($("#book-list").children).indexOf(
        e.target.closest(".book-item")
      );
      this.books.splice(deleteBookIndex, 1);
      //#2) 변경된 상태 기록
      store.setlocalStorage("books", this.books);
      //#3)
      //도서 갯수 카운팅 출력
      // 3) 변경된 상태 기반으로 요소 렌더링
      const bookItems = this.books
        .map((book) => {
          return `
        <li class="book-item">
          <div class="book-info">
            <span class="book-name">${book.title}</span>
            <span class="book-price">₩${book.price.toLocaleString()}</span>
          </div>
          <div class="book-actions">
            <button class="edit-btn modal-toggle-btn" data-modal-target="editModal">수정</button>
            <button class="delete-btn">삭제</button>
          </div>
        </li>
      `;
        })
        .join("");

      $("#book-list").innerHTML = bookItems;

      updateBookCount();
    }
  };

  //1.도서 추가
  $("#book-regist-form").addEventListener("submit", (e) => {
    e.preventDefault(); //기본이벤트 방지]
    registBook();
  });

  //2.도서 수정 기능
  $("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      editBookForm(e);
    }

    if (e.target.classList.contains("delete-btn")) {
      deleteBook(e);
    }
  });

  $("#book-edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#book-edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    editBook();
  });
}

const product = new Product();
