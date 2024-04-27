import {
  uploadProfilePicture,
  getAvatar,
  updateUserInfo,
} from "./components.js";

let token, data;
window.onload = function () {
  token = sessionStorage.getItem("token");
  data = JSON.parse(sessionStorage.getItem("data"));
  if (token) {
    const usernameDiv = document.getElementsByClassName("username");
    const username = document.createElement("h1");
    username.classList.add("username");
    username.innerHTML = data.data.username;
    usernameDiv[0].appendChild(username);
    formsInit();
    avatarInit();
  } else {
    window.location.href = "login.html";
  }
};

let avatar;
function avatarInit() {
  avatar = document.querySelector(".avatar");
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
}

const fileInput = document.getElementById("avatar-input");

const changeAvatarButton = document.getElementById("change-avatar-button");
changeAvatarButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  uploadProfilePicture(fileInput.files[0], token);
  setTimeout(() => {
    window.location.reload();
  }, 1000);
});

let form;
const saveStatus = document.getElementById("save-status");

function formsInit() {
  form = document.getElementById("edit-form");

  const usernameInput = form.querySelector("#username");
  const emailInput = form.querySelector("#email");

  usernameInput.placeholder = data.data.username;
  emailInput.placeholder = data.data.email;

  const saveUsername = form.querySelector("#save-username");

  saveUsername.addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameInput = form.querySelector("#username");
    const username = usernameInput.value;

    const success = await updateUserInfo(username, "username", token);
    if (success) {
      saveStatus.innerHTML = "Username updated!";
      saveStatus.style.color = "green";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      saveStatus.innerHTML = "Username already in use!";
      saveStatus.style.color = "red";
    }
  });

  const saveEmail = form.querySelector("#save-email");

  saveEmail.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("#email");
    const email = emailInput.value;

    const success = await updateUserInfo(email, "email", token);
    if (success) {
      saveStatus.innerHTML = "Email updated!";
      saveStatus.style.color = "green";
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      saveStatus.innerHTML = "Email already in use!";
      saveStatus.style.color = "red";
    }
  });

  const favouriteRestaurantSelect = form.querySelector("#favourite-restaurant");

  createSelectOptions(favouriteRestaurantSelect);

  const saveFavoriteRestaurant = form.querySelector(
    "#save-favourite-restaurant"
  );
  saveFavoriteRestaurant.addEventListener("click", async (e) => {
    e.preventDefault();
    if (favouriteRestaurantSelect.value === "Select a restaurant") {
      saveStatus.innerHTML = "Please select a restaurant!";
      saveStatus.style.color = "red";
      return;
    } else {
      const success = await updateUserInfo(
        favouriteRestaurantSelect.value,
        "favouriteRestaurant",
        token
      );
      if (success) {
        saveStatus.innerHTML = "Favourite restaurant updated!";
        saveStatus.style.color = "green";
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  });
}

async function createSelectOptions(select) {
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/restaurants"
    );
    if (!response.ok) {
      throw new Error("Error fetching data");
    } else {
      const data = await response.json();
      data.forEach((restaurant) => {
        const option = document.createElement("option");
        option.value = restaurant._id;
        option.innerHTML = restaurant.name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error(error);
  }
}
