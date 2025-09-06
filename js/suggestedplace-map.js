// Basic Leaflet map initialization
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map')) {
        var map = L.map('map').setView([-1.2648, 36.8172], 13); // Example coordinates for Nairobi
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    }
});
// suggestedplace-map.js
// Handles map, draggable square, and image logic for suggestedplace.html

let map;
let markers = [];
const imagesData = [
    { src: 'https://i0.wp.com/colorfulsisters.com/wp-content/uploads/2020/09/Karura-Forest-Nature-Trails-Waterfalls-and-Cafe-Nairobi-Kenya-16.jpg?resize=768,1024&ssl=1', alt: 'Karura Forest Waterfall', lat: -1.232, lng: 36.834 },
    { src: 'https://hblimg.mmtcdn.com/content/hubble/img/nairobidestimages/mmt/activities/m_Karura_Forest_2_l_480_640.jpg', alt: 'Karura Forest Trail', lat: -1.234, lng: 36.832 },
    { src: 'https://media-cdn.tripadvisor.com/media/photo-o/0d/d0/ed/40/photo0jpg.jpg', alt: 'Karura Forest Trees', lat: -1.231, lng: 36.835 }
];


// Initialize Karura Forest map
let lastPinLat = null, lastPinLng = null;
document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([-1.233, 36.833], 14); // Karura Forest coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers for each gallery image location
    const locations = [
        { lat: -1.232, lng: 36.834, title: 'Karura Forest Waterfall', desc: 'A serene waterfall in Karura.' },
        { lat: -1.234, lng: 36.832, title: 'Karura Forest Trail', desc: 'A scenic walking trail.' },
        { lat: -1.231, lng: 36.835, title: 'Karura Forest Trees', desc: 'Majestic trees in the forest.' }
    ];

    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(`<b>${location.title}</b><br>${location.desc}`);
        marker.on('click', () => {
            showImagesForLocation(location.lat, location.lng);
        });
        markers.push(marker);
    });

    // Get user's location and add red marker
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
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
                .bindPopup('You are here!'); // Initial popup

            // Optionally pan to user's location
            map.panTo([userLat, userLng]);

            // Optional: Reverse geocode to get address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name || 'Unknown location';
                    userMarker.bindPopup(`You are at: ${address}`);
                    userMarker.openPopup(); // Re-open with updated info
                })
                .catch(error => {
                    console.error('Reverse geocoding error:', error);
                });
        }, error => {
            console.error('Geolocation error:', error);
            // Optional: Alert user if permission denied or error
            alert('Unable to get your location. Check permissions or try again.');
        });
    } else {
        console.log('Geolocation not supported by this browser.');
    }

    // Initially show all images
    showImagesForLocation();
    // Make the square draggable
    makeDraggable(document.getElementById('draggable-square'));
});

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