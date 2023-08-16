var mymap = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  id: 'mapbox.dark'
}).addTo(mymap);

function addMarker(lat, lng) {
  L.marker([lat, lng]).addTo(mymap);
}

// Function to handle location permission
async function getLocation() {
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      addMarker(latitude, longitude);

      mymap.setView([latitude, longitude], 13);
    } catch (error) {
      console.error("An error occurred while getting location:", error);
    }
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

getLocation();
