import {
  getRestaurants,
  restaurants,
  createModalContent,
  modal,
  span,
  createDailyMenu,
  createWeeklyMenu,
} from "./components.js";

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

export function createRestaurantDetailElement(detailName, detailValue) {
  const detailElement = document.createElement("p");
  detailElement.textContent =
      detailValue && detailValue !== "-"
          ? `${detailName}: ${detailValue}`
          : `${detailName}: Not available`;
  return detailElement;
}

try {
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (event) => {
    const updateTable = () => {
      const tbody = document.getElementById("table-body");
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      createTable(filteredRestaurants);
    };

    const sortValue = event.target.value;

    if (sortValue === "a-z") {
      filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
      updateTable();
    } else if (sortValue === "z-a") {
      filteredRestaurants.sort((a, b) => b.name.localeCompare(a.name));
      updateTable();
    } else if (sortValue === "closest-to-you") {
      navigator.geolocation.getCurrentPosition((position) => {
        const x1 = position.coords.latitude;
        const y1 = position.coords.longitude;
        filteredRestaurants.forEach((restaurant) => {
          let x2 = restaurant.location.coordinates[1];
          let y2 = restaurant.location.coordinates[0];
          restaurant.distance = Math.sqrt(
              Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
          );
        });
        filteredRestaurants.sort((a, b) => a.distance - b.distance);
        updateTable();
      });
    }
  });
} catch (error) {}

try {
  const cityFilter = document.getElementById("city-filter");
  cityFilter.addEventListener("change", (event) => {
    const filterValue = event.target.value;

    if (filterValue !== "all") {
      filteredRestaurants = restaurants.filter(restaurant => restaurant.city.toLowerCase() === filterValue);
    } else {
      filteredRestaurants = restaurants;
    }

    createTable(filteredRestaurants);
  });
} catch (error) {}

function createTable(restaurantsToDisplay) {
  try {
    const tbody = document.getElementById("table-body");
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    restaurantsToDisplay.forEach((restaurant) => {
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
      tbody.appendChild(row);
    });

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  } catch (error) {
    console.error(error);
  }
}

let filteredRestaurants;

getRestaurants().then(() => {
  filteredRestaurants = restaurants;
  createTable(restaurants);
});