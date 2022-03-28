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

  const tab_one = document.querySelector(".tab-one");
  const tab_two = document.querySelector(".tab-two");

  tab_header_one?.addEventListener("click", () => {
    tab_one.style.display = "block";
    tab_two.style.display = "none";
  });

  tab_header_two?.addEventListener("click", () => {
    tab_two.style.display = "block";
    tab_one.style.display = "none";
  });

  //chart

  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
