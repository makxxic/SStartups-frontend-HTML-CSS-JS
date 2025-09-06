// draggable.js
// Handles draggable square and line drawing

export function makeDraggable(elem, getPinCoords, drawLineToPin) {
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
        const { lat, lng } = getPinCoords();
        if (lat !== null && lng !== null) {
            drawLineToPin(lat, lng);
        }
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Redraw line after drag ends
        const { lat, lng } = getPinCoords();
        if (lat !== null && lng !== null) {
            drawLineToPin(lat, lng);
        }
    }
}

export function drawLineToPin(map, lat, lng, squareElem, svgElem) {
    const mapDiv = map._container;
    const squareRect = squareElem.getBoundingClientRect();
    const mapRect = mapDiv.getBoundingClientRect();
    const squareX = squareRect.left + squareRect.width / 2 - mapRect.left;
    const squareY = squareRect.top + squareRect.height / 2 - mapRect.top;
    const point = map.latLngToContainerPoint([lat, lng]);
    svgElem.innerHTML = `<line x1="${squareX}" y1="${squareY}" x2="${point.x}" y2="${point.y}" stroke="red" stroke-width="2" />`;
}

export function clearLineToPin(svgElem) {
    svgElem.innerHTML = '';
}
