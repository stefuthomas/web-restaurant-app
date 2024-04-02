import { clearAccountButtons, createLogoutButton, createProfileButton} from "/layout/scripts/components.js";

window.onload = function() {
    const token = sessionStorage.getItem('token');
    const data = JSON.parse(sessionStorage.getItem('data'));

    if (token) {
        clearAccountButtons();
        createLogoutButton();
        createProfileButton();
    } else {
        console.log('User not logged in');
    }
}