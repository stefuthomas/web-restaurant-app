export const restaurants = [];
export const modal = document.getElementById("myModal");
export const span = document.getElementsByClassName("close")[0];

import { createRestaurantDetailElement } from "/layout/scripts/restaurants.js";

export async function getRestaurants() {
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

export async function getDailyMenu(id) {
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

export async function getWeeklyMenu(id) {
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

export function clearAccountButtons() {
  const accountButtons = document.querySelector(".account-buttons");
  while (accountButtons.firstChild) {
    accountButtons.removeChild(accountButtons.firstChild);
  }
}

export function createLogoutButton() {
  const accountButtons = document.querySelector(".account-buttons");
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
  accountButtons.appendChild(logoutButton);
}

export function createProfileButton() {
  const accountButtons = document.querySelector(".account-buttons");
  const profileButton = document.createElement("button");
  profileButton.textContent = "Profile";
  accountButtons.appendChild(profileButton);
  profileButton.addEventListener("click", () => {
    window.location.href = "editprofile.html";
  });
}

export function createUserData(loggedIn) {
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
        ? data.data.favouriteRestaurant.classList.add("link")
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

export async function uploadProfilePicture(file, token,) {
  const formData = new FormData();
  formData.append("avatar", file);
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/users/avatar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    let data = await response.json();
    sessionStorage.setItem("data", JSON.stringify(data));
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function getAvatar(data, token) {
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/uploads/${data.data.avatar}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.log("Error: ", response);
      return "/layout/styles/images/default-avatar.jpg";
    } else {
      const avatar = await response.blob();
      return URL.createObjectURL(avatar);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function updateUserInfo(change, changeType, token) {
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/users",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [changeType] : change,
        }),
      }
    );

    let data = await response.json();

    if (response.ok) {
      sessionStorage.setItem("data", JSON.stringify(data));
      return true;
    } else {
      console.log(data);
      return false;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}