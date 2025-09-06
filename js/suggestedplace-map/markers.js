// markers.js
// Handles marker creation and gallery display

export function addMarkers(map, locations, imagesData, showImagesForLocation) {
    const markers = [];
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(`<b>${location.title}</b><br>${location.desc}`);
        marker.on('click', () => {
            showImagesForLocation(location.lat, location.lng);
        });
        markers.push(marker);
    });
    return markers;
}

export function showImagesForLocation(imagesData, lat, lng, galleryElem, panToLocation, drawLineToPin, clearLineToPin) {
    galleryElem.innerHTML = '';
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
        galleryElem.appendChild(imageElem);
    });
    if (lat !== undefined && lng !== undefined) {
        drawLineToPin(lat, lng);
    } else {
        clearLineToPin();
    }
}
