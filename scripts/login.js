const form = document.getElementById("login-form");

const loginMessage = document.getElementById("login-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let username = form.username.value;
  let password = form.password.value;
  login(username, password);
});

async function login(username, password) {
  const response = await fetch(
    "https://10.120.32.94/restaurant/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }
  );

  let data = await response.json();

  if (response.ok) {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("data", JSON.stringify(data));
    loginMessage.innerHTML = "Login successful!";
    loginMessage.style.color = "green";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } else {
    loginMessage.innerHTML = data.message + "!";
    loginMessage.style.color = "red";
  }
}
