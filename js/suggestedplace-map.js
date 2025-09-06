// suggestedplace-map.js
// Handles map, draggable square, and image logic for suggestedplace.html

let map;
let markers = [];
let imagesData = [];
let locations = [];
let lastPinLat = null, lastPinLng = null;

// Preference for suggestions (e.g., 'nature' for forests/rivers, 'hiking' for trails/hills). Can be set via UI later.
const preference = 'nature'; // Options: 'nature', 'hiking', etc.

document.addEventListener('DOMContentLoaded', async () => {
    map = L.map('map').setView([-1.2648, 36.8172], 13); // Initial view (Nairobi), updates to user location
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get user's location and add red marker
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Custom red icon
            const redIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Add red marker for user
            const userMarker = L.marker([userLat, userLng], { icon: redIcon }).addTo(map)
                .bindPopup('You are here!');

            // Pan to user's location
            map.panTo([userLat, userLng]);

            // Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name || 'Unknown location';
                    userMarker.bindPopup(`You are at: ${address}`);
                    userMarker.openPopup();
                })
                .catch(error => {
                    console.error('Reverse geocoding error:', error);
                });

            // Now fetch and initialize suggestions based on user location
            await initializeMapAndMarkers(userLat, userLng);
        } catch (error) {
            console.error('Geolocation error:', error);
            alert('Unable to get your location. Check permissions or try again.');
            // Fallback: Use default Nairobi coords for suggestions
            await initializeMapAndMarkers(-1.2648, 36.8172);
        }
    } else {
        console.log('Geolocation not supported by this browser.');
        // Fallback: Use default
        await initializeMapAndMarkers(-1.2648, 36.8172);
    }

    // Make the square draggable
    makeDraggable(document.getElementById('draggable-square'));
});

// Modular function to fetch nearby places using Overpass API
async function fetchNearbyPlaces(lat, lng, pref) {
    let query = '';
    if (pref === 'hiking') {
        // For hiking: focus on paths, hills, trails
        query = `[out:json]; (nwr["highway"="path"](around:10000,${lat},${lng}); nwr["natural"="hill"](around:10000,${lat},${lng}); nwr["route"="hiking"](around:10000,${lat},${lng});); out center;`;
    } else {
        // Default 'nature': parks, forests, reserves, rivers
        query = `[out:json]; (nwr["leisure"="park"](around:10000,${lat},${lng}); nwr["leisure"="nature_reserve"](around:10000,${lat},${lng}); nwr["natural"="wood"](around:10000,${lat},${lng}); nwr["waterway"="river"](around:10000,${lat},${lng});); out center;`;
    }
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    // Filter places with names
    return data.elements.filter(el => el.tags && el.tags.name).map(el => ({
        name: el.tags.name,
        lat: el.lat || el.center.lat,
        lng: el.lon || el.center.lon,
        desc: `A cool ${pref} spot: ${el.tags.leisure || el.tags.natural || 'place'} near you.`
    }));
}

// Modular function to fetch images from Wikimedia Commons
async function fetchImagesForPlace(placeName) {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=3&gsrsearch=${encodeURIComponent(placeName + ' Nairobi')}&prop=imageinfo&iiprop=url&origin=*`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    if (!data.query || !data.query.pages) return [];
    return Object.values(data.query.pages).map(page => ({
        src: page.imageinfo[0].url,
        alt: page.title.replace('File:', ''),
        lat: null, // Will set to place lat/lng later
        lng: null
    }));
}

// Modular function to initialize markers and images after fetches
async function initializeMapAndMarkers(userLat, userLng) {
    // Fetch nearby places
    let nearbyPlaces = await fetchNearbyPlaces(userLat, userLng, preference);
    
    // Randomly pick 3 (shuffle and slice)
    nearbyPlaces = nearbyPlaces.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // For each place, fetch images and build data
    for (const place of nearbyPlaces) {
        const images = await fetchImagesForPlace(place.name);
        images.forEach(img => {
            img.lat = place.lat;
            img.lng = place.lng;
            imagesData.push(img);
        });
        locations.push({
            lat: place.lat,
            lng: place.lng,
            title: place.name,
            desc: place.desc
        });
    }
    
    // Add markers for each suggested place
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(`<b>${location.title}</b><br>${location.desc}`);
        marker.on('click', () => {
            showImagesForLocation(location.lat, location.lng);
        });
        markers.push(marker);
    });

    // Initially show all images
    showImagesForLocation();
}

function showImagesForLocation(lat, lng) {
    const gallery = document.getElementById('gallery-square');
    gallery.innerHTML = '';
    let filtered = imagesData;
    if (lat !== undefined && lng !== undefined) {
        filtered = imagesData.filter(img => img.lat === lat && img.lng === lng);
    }
    filtered.forEach(img => {
        const imageElem = document.createElement('img');
        imageElem.src = img.src;
        imageElem.alt = img.alt;
        imageElem.className = 'gallery-img';
        imageElem.setAttribute('data-lat', img.lat);
        imageElem.setAttribute('data-lng', img.lng);
        imageElem.onclick = function() { panToLocation(this); };
        gallery.appendChild(imageElem);
    });
    // Draw line to pin if location is selected
    if (lat !== undefined && lng !== undefined) {
        lastPinLat = lat;
        lastPinLng = lng;
        drawLineToPin(lat, lng);
    } else {
        lastPinLat = null;
        lastPinLng = null;
        clearLineToPin();
    }
}

function panToLocation(img) {
    const lat = parseFloat(img.getAttribute('data-lat'));
    const lng = parseFloat(img.getAttribute('data-lng'));
    map.panTo([lat, lng]);
    const marker = markers.find(m => m.getLatLng().lat === lat && m.getLatLng().lng === lng);
    if (marker) marker.openPopup();
    openModal(img.src, img.alt); // Also open the modal for enlarged image
    lastPinLat = lat;
    lastPinLng = lng;
    drawLineToPin(lat, lng);
}

function drawLineToPin(lat, lng) {
    const mapDiv = document.getElementById('map');
    const square = document.getElementById('draggable-square');
    const svg = document.getElementById('line-overlay');
    // Get square center
    const squareRect = square.getBoundingClientRect();
    const mapRect = mapDiv.getBoundingClientRect();
    const squareX = squareRect.left + squareRect.width / 2 - mapRect.left;
    const squareY = squareRect.top + squareRect.height / 2 - mapRect.top;
    // Convert lat/lng to pixel position on map
    const point = map.latLngToContainerPoint([lat, lng]);
    // Draw SVG line
    svg.innerHTML = `<line x1="${squareX}" y1="${squareY}" x2="${point.x}" y2="${point.y}" stroke="red" stroke-width="2" />`;
}

function clearLineToPin() {
    const svg = document.getElementById('line-overlay');
    svg.innerHTML = '';
}

function makeDraggable(elem) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elem.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";
        // Always redraw line to last selected pin if any
        if (lastPinLat !== null && lastPinLng !== null) {
            drawLineToPin(lastPinLat, lastPinLng);
        }
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Modal logic assumed to be in suggestedplace.js