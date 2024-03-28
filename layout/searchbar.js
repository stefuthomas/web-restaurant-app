import {
  createModalContent,
  modal,
  span,
  createDailyMenu,
  createWeeklyMenu,
  restaurants,
} from "/layout/restaurants.js";

const searchbarInput = document.querySelector(".searchbar input");
searchbarInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const search = searchbarInput.value;
    let found = false;
    for (let i = 0; i < restaurants.length - 1; i++) {
      const restaurant = restaurants[i];
      const restaurantName = restaurant.name;
      if (restaurantName.toLowerCase() === search.toLowerCase()) {
        found = true;
        modal.style.display = "block";

        const modalContent = createModalContent(restaurant);
        const menuButtons = document.createElement("div");
        menuButtons.classList.add("menu-buttons");
        modalContent.appendChild(menuButtons);

        const dailyMenuButton = document.createElement("button");
        dailyMenuButton.textContent = "Daily Menu";
        menuButtons.appendChild(dailyMenuButton);
        dailyMenuButton.addEventListener("click", () => {
          createDailyMenu(restaurant._id, modalContent);
        });

        const weeklyMenuButton = document.createElement("button");
        weeklyMenuButton.textContent = "Weekly Menu";
        menuButtons.appendChild(weeklyMenuButton);
        weeklyMenuButton.addEventListener("click", () => {
          createWeeklyMenu(restaurant._id, modalContent);
        });
        span.onclick = () => {
          modal.style.display = "none";
        };

        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
        break;
      }
    }
    // TODO: make the message to be in a modal instead of an alert.
    if (!found) {
      alert("Restaurant not found");
    }
  }
});
