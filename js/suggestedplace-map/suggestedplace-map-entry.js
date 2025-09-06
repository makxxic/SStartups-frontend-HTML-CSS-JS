// main.js
// Combines all modules for suggestedplace-map functionality

import { initializeMap } from './map-init.js';
import { fetchNearbyPlaces } from './places.js';
import { fetchImagesForPlace } from './images.js';
import { addMarkers, showImagesForLocation } from './markers.js';
import { makeDraggable, drawLineToPin, clearLineToPin } from './draggable.js';

let map;
let markers = [];
let imagesData = [];
let locations = [];
let lastPinLat = null, lastPinLng = null;
const preference = 'nature';

window.addEventListener('DOMContentLoaded', async () => {
    map = await initializeMap('map', [-1.2648, 36.8172], async (mapInstance, userLat, userLng) => {
        let nearbyPlaces = await fetchNearbyPlaces(userLat, userLng, preference);
        nearbyPlaces = nearbyPlaces.sort(() => 0.5 - Math.random()).slice(0, 3);
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
        markers = addMarkers(mapInstance, locations, imagesData, (lat, lng) => {
            lastPinLat = lat;
            lastPinLng = lng;
            showImagesForLocation(imagesData, lat, lng, document.getElementById('gallery-square'), panToLocation, (lat, lng) => drawLineToPin(mapInstance, lat, lng, document.getElementById('draggable-square'), document.getElementById('line-overlay')), () => clearLineToPin(document.getElementById('line-overlay')));
        });
        showImagesForLocation(imagesData, undefined, undefined, document.getElementById('gallery-square'), panToLocation, (lat, lng) => drawLineToPin(mapInstance, lat, lng, document.getElementById('draggable-square'), document.getElementById('line-overlay')), () => clearLineToPin(document.getElementById('line-overlay')));
    });
    makeDraggable(document.getElementById('draggable-square'), lastPinLat, lastPinLng, (lat, lng) => drawLineToPin(map, lat, lng, document.getElementById('draggable-square'), document.getElementById('line-overlay')));
    
    // Responsive line redraw
    function redrawLine() {
        if (lastPinLat !== null && lastPinLng !== null) {
            drawLineToPin(map, lastPinLat, lastPinLng, document.getElementById('draggable-square'), document.getElementById('line-overlay'));
        }
    }
    map.on('move', redrawLine);
    map.on('zoom', redrawLine);
    window.addEventListener('resize', redrawLine);
});

function panToLocation(img) {
    const lat = parseFloat(img.getAttribute('data-lat'));
    const lng = parseFloat(img.getAttribute('data-lng'));
    map.panTo([lat, lng]);
    const marker = markers.find(m => m.getLatLng().lat === lat && m.getLatLng().lng === lng);
    if (marker) marker.openPopup();
    if (window.openModal) window.openModal(img.src, img.alt);
    lastPinLat = lat;
    lastPinLng = lng;
    drawLineToPin(map, lat, lng, document.getElementById('draggable-square'), document.getElementById('line-overlay'));
}
