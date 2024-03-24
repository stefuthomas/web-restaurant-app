const restaurants = [];

const table = document.getElementById("restaurants-table");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

async function getRestaurants() {
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/restaurants"
    );
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    } else {
      const data = await response.json();
      console.log(data);
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

function createTable() {
  restaurants.forEach((restaurant) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");

    nameCell.textContent = restaurant.name;
    row.appendChild(nameCell);

    const addressCell = document.createElement("td");
    addressCell.textContent = restaurant.address;

    row.appendChild(addressCell);

    row.addEventListener("click", () => {
      document.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("highlight");
      });
      row.classList.add("highlight");
      modal.style.display = "block";

      const modalContent = document.querySelector(".modal-content");

      while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
      }

      const restaurantName = document.createElement("h2");
      restaurantName.classList.add("restaurant-name");
      restaurantName.textContent = restaurant.name;
      modalContent.appendChild(restaurantName);

      const restaurantAddress = document.createElement("p");
      restaurantAddress.textContent = restaurant.address ? 'Address: ' + restaurant.address : "Not available";
      const restaurantPostalCode = document.createElement("p");
      restaurantPostalCode.textContent = restaurant.postalCode ? 'Postal code: ' + restaurant.postalCode : "Not available";
      const restaurantCity = document.createElement("p");
      restaurantCity.textContent = restaurant.city ? 'City: ' + restaurant.city : "Not available";
      const restaurantPhone = document.createElement("p");
      restaurantPhone.textContent = restaurant.phone!='-' ? 'Phone: ' + restaurant.phone : " Phone: Not available";
      console.log(restaurant.phone);
      const restaurantCompany = document.createElement("p");
      restaurantCompany.textContent = restaurant.company ? 'Company: ' + restaurant.company : "Not available";

      modalContent.appendChild(restaurantAddress);
      modalContent.appendChild(restaurantPostalCode);
      modalContent.appendChild(restaurantCity);
      modalContent.appendChild(restaurantPhone);
      modalContent.appendChild(restaurantCompany);

      const courses = getDailyMenu(restaurant._id);
      courses.then((data) => {
        const menu = document.createElement("h3");
        menu.classList.add("menu");
        menu.textContent = "Menu";
        modalContent.appendChild(menu);
        console.log(data);
        const courseList = document.createElement("ul");
        data.courses.forEach((course) => {
          const courseName = document.createElement("li");
          courseName.textContent = course.name;
          courseList.appendChild(courseName);
          modalContent.appendChild(courseName);
        });
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

getRestaurants();