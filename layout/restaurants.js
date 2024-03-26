const restaurants = [];
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
      createTable();
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
  detailElement.textContent = detailValue && detailValue !== '-' 
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

  modalContent.appendChild(createRestaurantDetailElement('Address', restaurant.address));
  modalContent.appendChild(createRestaurantDetailElement('Postal code', restaurant.postalCode));
  modalContent.appendChild(createRestaurantDetailElement('City', restaurant.city));
  modalContent.appendChild(createRestaurantDetailElement('Phone', restaurant.phone));
  modalContent.appendChild(createRestaurantDetailElement('Company', restaurant.company));

  return modalContent;
}

export function addCoursesToModalContent(restaurantId, modalContent) {
  const courses = getDailyMenu(restaurantId);
  const coursesWeekly = getWeeklyMenu(restaurantId);
  coursesWeekly.then(console.log("Weekly courses: ", coursesWeekly));   // TODO: Immplement weekly courses
  courses.then((data) => {
    const dailyMenu = document.createElement("h3");
    const currentDate = new Date();
    dailyMenu.textContent = "Daily menu for " + currentDate.toLocaleDateString();
    modalContent.appendChild(dailyMenu);

    if (data.courses.length === 0) {
      const noCourses = document.createElement("p");
      noCourses.textContent = "No courses available";
      modalContent.appendChild(noCourses);
    } else {
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
      modalContent.appendChild(courseDiv);
    }
  });
}

function createTable() {
  restaurants.forEach((restaurant) => {
    const row = createTableRow(restaurant);

    row.addEventListener("click", () => {
      document.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("highlight");
      });
      row.classList.add("highlight");
      modal.style.display = "block";

      const modalContent = createModalContent(restaurant);
      addCoursesToModalContent(restaurant._id, modalContent);
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

getRestaurants();