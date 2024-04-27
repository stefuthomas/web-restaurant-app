import {
  getRestaurant,
  getAvatar,
  createModalContent,
  modal,
  createDailyMenu,
  createWeeklyMenu,
} from "./components.js";

window.onload = function () {
  const token = sessionStorage.getItem("token");

  if (token) {
    clearAccountButtons();
    createLogoutButton();
    createProfileButton();
    createUserData(true);
  } else {
    createUserData(false);
  }
};

function clearAccountButtons() {
  const accountButtons = document.querySelector(".account-buttons");
  while (accountButtons.firstChild) {
    accountButtons.removeChild(accountButtons.firstChild);
  }
}
function createLogoutButton() {
  const accountButtons = document.querySelector(".account-buttons");
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
  accountButtons.appendChild(logoutButton);
}

function createProfileButton() {
  const accountButtons = document.querySelector(".account-buttons");
  const profileButton = document.createElement("button");
  profileButton.textContent = "Profile";
  accountButtons.appendChild(profileButton);
  profileButton.addEventListener("click", () => {
    window.location.href = "editprofile.html";
  });
}

function createUserData(loggedIn) {
  const profile = document.getElementById("profile-info");
  const userData = document.createElement("div");
  userData.classList.add("user-data");

  if (loggedIn) {
    const data = JSON.parse(sessionStorage.getItem("data"));
    const token = sessionStorage.getItem("token");

    const avatar = document.createElement("img");

    if (!data.data.avatar) {
      avatar.src = "/layout/styles/images/default-avatar.jpg";
    } else {
      getAvatar(data, token)
        .then((url) => {
          avatar.src = url;
        })
        .catch((error) => {
          console.error(error);
        });
    }
    avatar.alt = "User avatar";
    avatar.classList.add("user-avatar");
    userData.appendChild(avatar);

    const account = document.createElement("h3");
    account.textContent = data.data.username;
    userData.appendChild(account);

    const favouriteRestaurantDiv = document.createElement("div");
    favouriteRestaurantDiv.classList.add("favourite-restaurant");

    const favouriteRestaurantText = document.createElement("p");
    favouriteRestaurantText.textContent = "Favourite restaurant: ";
    favouriteRestaurantDiv.appendChild(favouriteRestaurantText);

    const favouriteRestaurant = document.createElement("a");
    favouriteRestaurant.textContent =
      data.data.favouriteRestaurant != null
        ? createFavouriteRestaurantLink(
            data.data.favouriteRestaurant,
            favouriteRestaurant
          )
        : "Favourite restaurant not specified yet.";

    favouriteRestaurantDiv.appendChild(favouriteRestaurant);

    userData.appendChild(favouriteRestaurantDiv);

    const profileLink = document.createElement("a");
    profileLink.textContent = "Edit profile";
    profileLink.classList.add("link");
    profileLink.href = "editprofile.html";
    userData.appendChild(profileLink);
  } else {
    const loginMessage = document.createElement("p");
    loginMessage.innerHTML = "Please login to view your profile&nbsp;";
    const loginLink = document.createElement("a");
    loginLink.classList.add("link");
    loginLink.textContent = "here.";
    loginLink.href = "login.html";
    loginMessage.appendChild(loginLink);
    userData.appendChild(loginMessage);

    const signupMessage = document.createElement("p");
    signupMessage.innerHTML = "Don't have an account? &nbsp;";
    const signupLink = document.createElement("a");
    signupLink.classList.add("link");
    signupLink.textContent = "Sign up for free!";
    signupLink.href = "signup.html";
    signupMessage.appendChild(signupLink);
    userData.appendChild(signupMessage);
  }

  profile.appendChild(userData);
}

function createFavouriteRestaurantLink(restaurantId, favouriteRestaurant) {
  const restaurantData = getRestaurant(restaurantId);
  restaurantData.then((data) => {
    favouriteRestaurant.textContent = data.name;
    favouriteRestaurant.classList.add("link");
    favouriteRestaurant.addEventListener("click", () => {
      modal.style.display = "block";
      const modalContent = createModalContent(data);
      const menuButtons = document.createElement("div");
      menuButtons.classList.add("menu-buttons");
      modalContent.appendChild(menuButtons);
      const dailyMenuButton = document.createElement("button");
      dailyMenuButton.textContent = "Daily menu";
      menuButtons.appendChild(dailyMenuButton);
      dailyMenuButton.addEventListener("click", () => {
        createDailyMenu(data._id, modalContent);
        dailyMenuButton.disabled = true;
        weeklyMenuButton.disabled = false;
      });

      const weeklyMenuButton = document.createElement("button");
      weeklyMenuButton.textContent = "Weekly menu";
      menuButtons.appendChild(weeklyMenuButton);
      weeklyMenuButton.addEventListener("click", () => {
        createWeeklyMenu(data._id, modalContent);
        weeklyMenuButton.disabled = true;
        dailyMenuButton.disabled = false;
      });
    });
  });
}
