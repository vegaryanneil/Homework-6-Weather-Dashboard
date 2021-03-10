// After page loads - we can get our location
window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition => {
        long = showPosition.coords.longitude;
        lat = showPosition.coords.latitude;
    })
}
});
