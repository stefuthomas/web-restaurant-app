import { clearAccountButtons, createLogoutButton, createProfileButton, createUserData} from "/layout/scripts/components.js";

window.onload = function() {
    const token = sessionStorage.getItem('token');

    if (token) {
        clearAccountButtons();
        createLogoutButton();
        createProfileButton();
        createUserData(true);

    } else {
        createUserData(false);
    }
}