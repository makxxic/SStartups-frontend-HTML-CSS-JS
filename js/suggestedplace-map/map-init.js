// map-init.js
// Handles map setup and user location

export async function initializeMap(mapElementId, defaultCoords, onUserLocation) {
    const map = L.map(mapElementId).setView(defaultCoords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const redIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            const userMarker = L.marker([userLat, userLng], { icon: redIcon }).addTo(map)
                .bindPopup('You are here!');
            map.panTo([userLat, userLng]);
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name || 'Unknown location';
                    userMarker.bindPopup(`You are at: ${address}`);
                    userMarker.openPopup();
                });
            onUserLocation(map, userLat, userLng);
        } catch (error) {
            onUserLocation(map, defaultCoords[0], defaultCoords[1]);
        }
    } else {
        onUserLocation(map, defaultCoords[0], defaultCoords[1]);
    }
    return map;
}
