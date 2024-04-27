import {
  createModalContent,
  modal,
  span,
  createDailyMenu,
  createWeeklyMenu,
  restaurants,
} from "./components.js";

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
        openModal(restaurant);
        break;
      }
    }
    if (!found) {
      const modalContent = document.querySelector(".modal-content");
      while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
      }
      notFoundContent(modalContent);
    }
  }
});

function openModal(restaurant) {
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
}

function notFoundContent(modalContent) {
  const search = searchbarInput.value;

  const span = document.createElement("span");
  span.classList.add("close");
  span.textContent = "×";
  modalContent.appendChild(span);

  const notFoundText = document.createElement("h3");
  notFoundText.textContent = `No restaurants for search: "${search}"`;
  modalContent.appendChild(notFoundText);

  const matchingRestaurantsList = document.createElement("ul");
  matchingRestaurantsList.classList.add("matching-restaurants-list");
  let found = false;
  for (let i = 0; i < restaurants.length - 1; i++) {
    const restaurant = restaurants[i];
    const restaurantName = restaurant.name;
    if (restaurantName.toLowerCase().includes(search.toLowerCase())) {
      found = true;
      const matchingRestaurant = document.createElement("li");
      matchingRestaurant.textContent = restaurant.name;
      matchingRestaurant.addEventListener("click", () => {
        openModal(restaurant);
      });
      matchingRestaurantsList.appendChild(matchingRestaurant);
    }
  }

  if (found) {
    const suggestedRestaurants = document.createElement("h3");

    suggestedRestaurants.textContent = "Did you mean:";
    suggestedRestaurants.classList.add("suggested");
    modalContent.appendChild(suggestedRestaurants);
    modalContent.appendChild(matchingRestaurantsList);
  } else {
    const suggestedActions = document.createElement("h3");
    suggestedActions.textContent = "Suggestions:";
    suggestedActions.classList.add("suggested");
    const suggestionsList = document.createElement("ul");
    suggestionsList.classList.add("suggestions-list");
    const suggestion1 = document.createElement("li");
    suggestion1.textContent = "Check your spelling for typos";
    suggestionsList.appendChild(suggestion1);

    const suggestion2 = document.createElement("li");
    suggestion2.textContent = "Try searching for a different restaurant";
    suggestionsList.appendChild(suggestion2);

    const suggestion3 = document.createElement("li");
    suggestion3.textContent =
      "The restaurant you are looking for might not be in our range of restaurants";
    suggestionsList.appendChild(suggestion3);

    modalContent.appendChild(suggestedActions);
    modalContent.appendChild(suggestionsList);
  }
  modalContent.appendChild(matchingRestaurantsList);

  span.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  modal.style.display = "block";
}
