window.onload = function() {
    const token = sessionStorage.getItem('token');
    const data = JSON.parse(sessionStorage.getItem('data'));

    if (token) {
        console.log('User is logged in');
        console.log('Token:', token);
        console.log(data.data.username);
    } else {
        console.log('User is not logged in');

    }
}