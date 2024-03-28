export const restaurants = [];

const table = document.getElementById("restaurants-table");
export const modal = document.getElementById("myModal");
export const span = document.getElementsByClassName("close")[0];

async function getRestaurants() {
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/restaurants"
    );
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    } else {
      const data = await response.json();
      data.forEach((restaurant) => {
        restaurants.push(restaurant);
      });
      restaurants.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  return restaurants;
}

async function getDailyMenu(id) {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`
    );
    if (!response.ok) {
      throw new Error(error);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getWeeklyMenu(id) {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`
    );
    if (!response.ok) {
      throw new Error(error);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

function createTableRow(restaurant) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.textContent = restaurant.name;
  row.appendChild(nameCell);

  const addressCell = document.createElement("td");
  addressCell.textContent = restaurant.address;
  row.appendChild(addressCell);

  return row;
}

function createRestaurantDetailElement(detailName, detailValue) {
  const detailElement = document.createElement("p");
  detailElement.textContent =
    detailValue && detailValue !== "-"
      ? `${detailName}: ${detailValue}`
      : `${detailName}: Not available`;
  return detailElement;
}

export function createModalContent(restaurant) {
  const modalContent = document.querySelector(".modal-content");

  while (modalContent.firstChild) {
    modalContent.removeChild(modalContent.firstChild);
  }

  const restaurantName = document.createElement("h2");
  restaurantName.classList.add("restaurant-name");
  restaurantName.textContent = restaurant.name;
  modalContent.appendChild(restaurantName);

  modalContent.appendChild(
    createRestaurantDetailElement("Address", restaurant.address)
  );
  modalContent.appendChild(
    createRestaurantDetailElement("Postal code", restaurant.postalCode)
  );
  modalContent.appendChild(
    createRestaurantDetailElement("City", restaurant.city)
  );
  modalContent.appendChild(
    createRestaurantDetailElement("Phone", restaurant.phone)
  );
  modalContent.appendChild(
    createRestaurantDetailElement("Company", restaurant.company)
  );

  return modalContent;
}

export function createWeeklyMenu(restaurantId, modalContent) {
  const weeklyMenu = getWeeklyMenu(restaurantId);
  weeklyMenu.then((data) => {
    const existingNoCourses = modalContent.querySelector(".no-daily-courses");
    if (existingNoCourses) {
      modalContent.removeChild(existingNoCourses);
    }
    const existingCoursesTable = modalContent.querySelector(".courses-table");
    const existingDailyMenu = modalContent.querySelector(".daily-menu");
    const existingWeeklyMenu = modalContent.querySelector(".weekly-menu");
    if (existingCoursesTable) {
      modalContent.removeChild(existingCoursesTable);
    }
    if (existingDailyMenu) {
      modalContent.removeChild(existingDailyMenu);
    }
    if (existingWeeklyMenu) {
      modalContent.removeChild(existingWeeklyMenu);
    }

    if (data.days.length === 0) {
      if (!modalContent.querySelector(".no-weekly-courses")) {
        const noCourses = document.createElement("p");
        noCourses.classList.add("no-weekly-courses");
        noCourses.textContent = "No weekly courses available";
        modalContent.appendChild(noCourses);
      }
    } else {
      const weeklyMenu = document.createElement("h3");
      weeklyMenu.classList.add("weekly-menu");
      weeklyMenu.textContent = "Weekly menu";

      const courseDiv = document.createElement("div");
      courseDiv.classList.add("courses-table");

      const courseTable = document.createElement("table");
      courseDiv.appendChild(courseTable);

      const tableHeader = document.createElement("tr");
      const dateHeader = document.createElement("th");
      dateHeader.textContent = "Date";
      tableHeader.appendChild(dateHeader);

      const courseHeader = document.createElement("th");
      courseHeader.textContent = "Course";
      tableHeader.appendChild(courseHeader);

      const priceHeader = document.createElement("th");
      priceHeader.textContent = "Price";
      tableHeader.appendChild(priceHeader);

      const dietHeader = document.createElement("th");
      dietHeader.textContent = "Diets";
      tableHeader.appendChild(dietHeader);

      courseTable.appendChild(tableHeader);

      data.days.forEach((day) => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = day.date;
        row.appendChild(dateCell);

        day.courses.forEach((course) => {
          const row = document.createElement("tr");

          const dateCell = document.createElement("td");
          dateCell.textContent = day.date;
          row.appendChild(dateCell);

          const courseCell = document.createElement("td");
          courseCell.textContent = course.name;
          row.appendChild(courseCell);

          const priceCell = document.createElement("td");
          priceCell.textContent = course.price;
          row.appendChild(priceCell);

          const dietCell = document.createElement("td");
          dietCell.textContent = course.diets;
          row.appendChild(dietCell);

          courseTable.appendChild(row);
        });
      });

      modalContent.appendChild(weeklyMenu);
      modalContent.appendChild(courseDiv);
    }
  });
}

export function createDailyMenu(restaurantId, modalContent) {
  const courses = getDailyMenu(restaurantId);
  courses.then((data) => {
    const existingCoursesTable = modalContent.querySelector(".courses-table");
    const existingDailyMenu = modalContent.querySelector(".daily-menu");
    const existingWeeklyMenu = modalContent.querySelector(".weekly-menu");
    if (existingCoursesTable) {
      modalContent.removeChild(existingCoursesTable);
    }
    if (existingDailyMenu) {
      modalContent.removeChild(existingDailyMenu);
    }
    if (existingWeeklyMenu) {
      modalContent.removeChild(existingWeeklyMenu);
    }
    if (data.courses.length === 0) {
      const existingNoWeeklyCourses =
        modalContent.querySelector(".no-weekly-courses");
      if (existingNoWeeklyCourses) {
        modalContent.removeChild(existingNoWeeklyCourses);
      }
      if (!modalContent.querySelector(".no-daily-courses")) {
        const noCourses = document.createElement("p");
        noCourses.classList.add("no-daily-courses");
        noCourses.textContent = "No courses available";
        modalContent.appendChild(noCourses);
      }
    } else {
      const dailyMenu = document.createElement("h3");
      dailyMenu.classList.add("daily-menu");
      const currentDate = new Date();
      dailyMenu.textContent =
        "Daily menu for " + currentDate.toLocaleDateString();

      const courseDiv = document.createElement("div");
      courseDiv.classList.add("courses-table");

      const courseTable = document.createElement("table");
      courseDiv.appendChild(courseTable);

      const tableHeader = document.createElement("tr");
      const courseHeader = document.createElement("th");
      courseHeader.textContent = "Course";
      tableHeader.appendChild(courseHeader);

      const priceHeader = document.createElement("th");
      priceHeader.textContent = "Price";
      tableHeader.appendChild(priceHeader);

      const dietHeader = document.createElement("th");
      dietHeader.textContent = "Diets";
      tableHeader.appendChild(dietHeader);

      courseTable.appendChild(tableHeader);

      data.courses.forEach((course) => {
        const row = document.createElement("tr");

        const courseCell = document.createElement("td");
        courseCell.textContent = course.name;
        row.appendChild(courseCell);

        const priceCell = document.createElement("td");
        priceCell.textContent = course.price;
        row.appendChild(priceCell);

        const dietCell = document.createElement("td");
        dietCell.textContent = course.diets;
        row.appendChild(dietCell);

        courseTable.appendChild(row);
      });
      modalContent.appendChild(dailyMenu);
      modalContent.appendChild(courseDiv);
    }
  });
}

function createTable() {
  restaurants.forEach((restaurant) => {
    const row = createTableRow(restaurant);
    row.id = restaurant._id;

    row.addEventListener("click", () => {
      document.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("highlight");
      });
      row.classList.add("highlight");
      modal.style.display = "block";

      const modalContent = createModalContent(restaurant);
      const menuButtons = document.createElement("div");
      menuButtons.classList.add("menu-buttons");
      modalContent.appendChild(menuButtons);
      const dailyMenuButton = document.createElement("button");
      dailyMenuButton.textContent = "Daily menu";
      menuButtons.appendChild(dailyMenuButton);
      dailyMenuButton.addEventListener("click", () => {
        createDailyMenu(restaurant._id, modalContent);
        dailyMenuButton.disabled = true;
        weeklyMenuButton.disabled = false;
      });

      const weeklyMenuButton = document.createElement("button");
      weeklyMenuButton.textContent = "Weekly menu";
      menuButtons.appendChild(weeklyMenuButton);
      weeklyMenuButton.addEventListener("click", () => {
        createWeeklyMenu(restaurant._id, modalContent);
        weeklyMenuButton.disabled = true;
        dailyMenuButton.disabled = false;
      });
    });

    table.appendChild(row);
  });

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

getRestaurants().then(() => {
  createTable();
});
