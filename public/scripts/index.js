// const token = "<%= token %>";
// localStorage.setItem(token);

//set footer date
const today = new Date();
const footer = document.getElementById("footer-date");

footer.innerHTML = today.getFullYear();

//set tabs functionality

const tab_header_one = document.querySelector(".tab-header-one");
const tab_header_two = document.querySelector(".tab-header-two");

const tab_one = document.querySelector(".tab-one");
const tab_two = document.querySelector(".tab-two");

tab_header_one.addEventListener("click", () => {
  tab_one.style.display = "block";
  tab_two.style.display = "none";
});

tab_header_two.addEventListener("click", () => {
  tab_two.style.display = "block";
  tab_one.style.display = "none";
});
