const $ = (selector) => document.querySelector(selector);

// 저장소 객체
const store = {
  setlocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getlocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  },
};

function Product() {
  //상태관리 변수1. 도서상태
  this.books = {};

  //상태관리 변수2. 현재 선택된 카테고리 상태
  this.currentCategory = {};

  //초기화 메소드
  this.init = () => {
    //초기화1) 카테고리 초기화
    this.currentCategory = {
      code: "it",
      name: "IT",
    };
    renderCategory();
    /*{
    it: [{title: "xxx", price: xxxx}, {~~~~}],
    science: [{title: "xxx", price: xxxx}, {~~~~}],
    } >*/

    //초기화2) 도서상태 초기화
    this.books = store.getlocalStorage("books") || {
      it: [],
      science: [],
      literature: [],
      history: [],
    };
    if (this.books[this.currentCategory].length !== 0) {
      renderBook();
    }

    /*

    현재 도서객체 [{title: "xxx", price: xxxx}, {~~~~}]
    목표 : 객체의 카테고리 코드를 추가하는것
    1) [{title: "xxx", price: xxxx, category : "it"}, {~~~~}]

    2) { 
        it: [{title: "xxx", price: xxxx}, {~~~~}],
        science: [{title: "xxx", price: xxxx}, {~~~~}],
    } >
   */
  };
  // 재사용 함수: 도서의 갯수 카운팅해서 출력
  const updateBookCount = () => {
    $("#book-count").innerText = $("#book-list").children.length;
  };

  // 렌더링함수: 컴퓨터가 데이터(정보)를 받아와서 화면에 (이미지나 영상으로) 재현하는 과정

  //렌더링용 함수1. 도서상태 따라 렌더링 되는 함수
  const renderBook = () => {
    const bookItem = this.books[this.currentCategory.code]
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

    $("#book-list").innerHTML = bookItem;
    $("#book-count").innerText = this.books[this.currentCategory.code].lenght;
    updateBookCount();
  };
  //렌더링용 함수2. 현재 선택된 카테고리 상태에 따라 렌더링 되는 함수
  const renderCategory = () => {
    $("#book-category-name").innerText = this.currentCategory.name;
    document.querySelectorAll(".category-btn").forEach((categoryBtn) => {
      categoryBtn.classList.toggle(
        "active",
        categoryBtn.dataset.categoryCode == this.currentCategory.code
      ); //toggle= 있으면 삭제 없으면 추가 // 혹은 작동 , 조건 => 조건일 때만 작동 함
    });
  };

  // 기능용 함수 : 동작 내 기능을 묶는 함수

  // 기능용 함수1. 도서 추가 기능
  const registBook = () => {
    const bookName = $("#book-name-input").value;
    const bookPrice = Number($("#book-price-input").value);

    if (!bookName.trim() || !bookPrice) {
      alert("값을 다시 입력해 주세요.");
      return;
    }

    // 1) 도서상태 변경 (새로운 도서 추가)
    this.books[this.currentCategory.code].push({
      title: bookName,
      price: bookPrice,
    });

    // 2) 변경된 도서상태 저장
    store.setlocalStorage("books", this.books);

    // 3) 변경된 상태에 맞춰서 요소 렌더링
    renderBook();

    $("#book-regist-form").reset();
    $("#book-name-input").focus();
  };

  // 기능용 함수2-1. 도정 수정 폼에 띄우는 동작
  const editBookForm = (e) => {
    const $bookItem = e.target.closest(".book-item");
    const bookName = $bookItem.querySelector(".book-name").innerText;
    const bookPrice = Number(
      $bookItem.querySelector(".book-price").innerText.replace(/[₩,]/g, "")
    );
    const editbookIndex = Array.from($("#book-list").children).indexOf(
      $bookItem
    );

    $("#edit-book-name").value = bookName;
    $("#edit-book-price").value = bookPrice;
    $("#edit-book-index").value = editbookIndex;
  };

  //기능용 함수2_2. 모달창에 submit 동작할때 동작
  const editBook = () => {
    const editBookName = $("#edit-book-name").value;
    const editBookPrice = Number($("#edit-book-price").value);
    const editBookIndex = $("#edit-book-index").value;

    // 1) 도서 상태 변경(기존 도서 찾아서 수정)
    this.books[this.currentCategory.code][editBookIndex] = {
      title: editBookName,
      price: editBookPrice,
    };

    // 2) 변경된 상태 기록
    store.setlocalStorage("books", this.books);

    // 3) 변경된 상태 기반으로 요소 렌더링

    renderBook();
    $("#editModal .modal-close").click();
  };

  // 기능용 함수3. 도서삭제
  const deleteBook = (e) => {
    if (confirm("삭제하시겟습니까?")) {
      // 1) 도서 상태 변경(기존 도서 삭제)
      const deleteBookIndex = Array.from($("#book-list").children).indexOf(
        e.target.closest(".book-item")
      );
      this.books[this.currentCategory.code].splice(deleteBookIndex, 1);

      // 2) 변경된 상태 기록
      store.setlocalStorage("books", this.books);

      // 3) 변경된 상태 기반으로 요소 렌더링
      renderBook();
    }
  };

  //이벤트 핸들러 : 특정요소에 발생하는 이벤트를 처리하기 위해 사용하는 함수
  //이벤트 핸들러1. 카테고리 선택 이벤트 핸들러
  $(".category-select").addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
      //1) 카테고리 상태 변화
      this.currentCategory = {
        code: e.target.dataset.categoryCode,
        name: e.target.innerText,
      };
      //2) 카테고리 선택 하면 효과 active
      renderCategory();
      renderBook();
    }
  });

  //이벤트 핸들러2. 도서추가(submit) 이벤트헨들러
  $("#book-regist-form").addEventListener("submit", (e) => {
    e.preventDefault();
    registBook();
    updateBookCount();
  });

  //이벤트 핸들러3. 도서 수정 모달창 -도서 삭제 이벤트 핸들러
  $("#book-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      editBookForm(e);
    }

    if (e.target.classList.contains("delete-btn")) {
      deleteBook(e);
    }
  });

  //이벤트 헨들러4. 도서수정(submit) 이벤트 핸들러
  $("#book-edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    editBook();
  });
}

const product = new Product();
product.init();
