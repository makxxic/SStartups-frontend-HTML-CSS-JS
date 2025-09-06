// images.js
// Fetches images from Wikimedia Commons

export async function fetchImagesForPlace(placeName) {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=3&gsrsearch=${encodeURIComponent(placeName + ' Nairobi')}&prop=imageinfo&iiprop=url&origin=*`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    if (!data.query || !data.query.pages) return [];
    return Object.values(data.query.pages).map(page => ({
        src: page.imageinfo[0].url,
        alt: page.title.replace('File:', ''),
        lat: null,
        lng: null
    }));
}
