// places.js
// Fetches nearby places using Overpass API

export async function fetchNearbyPlaces(lat, lng, pref) {
    let query = '';
    if (pref === 'hiking') {
        query = `[out:json]; (nwr["highway"="path"](around:10000,${lat},${lng}); nwr["natural"="hill"](around:10000,${lat},${lng}); nwr["route"="hiking"](around:10000,${lat},${lng});); out center;`;
    } else {
        query = `[out:json]; (nwr["leisure"="park"](around:10000,${lat},${lng}); nwr["leisure"="nature_reserve"](around:10000,${lat},${lng}); nwr["natural"="wood"](around:10000,${lat},${lng}); nwr["waterway"="river"](around:10000,${lat},${lng});); out center;`;
    }
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.elements.filter(el => el.tags && el.tags.name).map(el => ({
        name: el.tags.name,
        lat: el.lat || el.center.lat,
        lng: el.lon || el.center.lon,
        desc: `A cool ${pref} spot: ${el.tags.leisure || el.tags.natural || 'place'} near you.`
    }));
}
