import {
  createModalContent,
  modal,
  span,
  createDailyMenu,
  createWeeklyMenu,
} from "/layout/scripts/restaurants.js";
let map, currentLocation;
const restaurants = [];

function createMap() {
  navigator.geolocation.getCurrentPosition((position) => {
    currentLocation = [position.coords.latitude, position.coords.longitude];
    map = L.map("map").setView(currentLocation, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  });
  createMarkers();
}

async function createMarkers() {
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

      restaurants.forEach((restaurant) => {
        const marker = L.marker([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ]).addTo(map);

        const popupContent = document.createElement("div");
        popupContent.classList.add("popup-content");
        const name = document.createElement("h3");
        name.textContent = restaurant.name;
        popupContent.appendChild(name);

        const popupButtons = document.createElement("div");
        popupButtons.classList.add("popup-buttons");
        popupContent.appendChild(popupButtons);

        const dailyMenuButton = document.createElement("button");
        dailyMenuButton.textContent = "Daily Menu";
        dailyMenuButton.onclick = () => {
          const modalContent = createModalContent(restaurant);
          createDailyMenu(restaurant._id, modalContent);
          modal.style.display = "block";
          span.onclick = function () {
            modal.style.display = "none";
          };
          window.onclick = function (event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          };
        };
        popupButtons.appendChild(dailyMenuButton);

        const weeklyMenuButton = document.createElement("button");
        weeklyMenuButton.textContent = "Weekly Menu";
        weeklyMenuButton.onclick = () => {
          const modalContent = createModalContent(restaurant);
          createWeeklyMenu(restaurant._id, modalContent);
          modal.style.display = "block";
          span.onclick = function () {
            modal.style.display = "none";
          };
          window.onclick = function (event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          };
        };
        popupButtons.appendChild(weeklyMenuButton);

        marker.bindPopup(popupContent);
      });
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

createMap();
