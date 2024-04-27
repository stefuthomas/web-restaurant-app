const form = document.getElementById("signup-form");

const signupMessage = document.getElementById("signup-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  if (password !== confirmPassword) {
    signupMessage.innerHTML = "Passwords do not match!";
    signupMessage.style.color = "red";
  } else {
    signup(username, email, password);
  }
});

async function signup(username, email, password) {
  const response = await fetch("https://10.120.32.94/restaurant/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });

  let data = await response.json();
  if (response.ok) {
    signupMessage.innerHTML = "Signup successful!";
    signupMessage.style.color = "green";
    sessionStorage.setItem("data", JSON.stringify(data));
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } else {
    if (data.message) {
      signupMessage.innerHTML = data.message;
      signupMessage.style.color = "red";
    } else if (data.issues[0].message) {
      signupMessage.innerHTML = data.issues[0].message;
      signupMessage.style.color = "red";
    }
  }
}
