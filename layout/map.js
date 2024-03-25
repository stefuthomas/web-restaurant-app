let map, currentLocation;

navigator.geolocation.getCurrentPosition((position) => {
  currentLocation = [position.coords.latitude, position.coords.longitude];
  map = L.map("map").setView(currentLocation, 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});
