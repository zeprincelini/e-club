window.onload = function () {
  // const token = "<%= token %>";
  // localStorage.setItem(token);

  //set footer date
  const today = new Date();
  const footer = document.getElementById("footer-date");

  footer.innerHTML = today.getFullYear();

  //set tabs functionality

  const tab_header_one = document.querySelector(".tab-header-one");
  const tab_header_two = document.querySelector(".tab-header-two");
  const tab_header_three = document.querySelector(".tab-header-three");

  const tab_one = document.querySelector(".tab-one");
  const tab_two = document.querySelector(".tab-two");
  const tab_three = document.querySelector(".tab-three");

  tab_header_one?.addEventListener("click", () => {
    tab_one.style.display = "block";
    tab_two.style.display = "none";
    tab_three.style.display = "none";
  });

  tab_header_two?.addEventListener("click", () => {
    tab_two.style.display = "block";
    tab_one.style.display = "none";
    tab_three.style.display = "none";
  });

  tab_header_three?.addEventListener("click", () => {
    tab_three.style.display = "block";
    tab_one.style.display = "none";
    tab_two.style.display = "none";
  });

  //sidebar
  const sidebar = document.querySelector(".sidebar");
  const trigger = document.querySelector(".menu");
  trigger.addEventListener("click", () => {
    sidebar.classList.toggle("opened");
  });
};
