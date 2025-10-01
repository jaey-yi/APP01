// 저장소 객체
export const store = {
  setlocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getlocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  },
};
