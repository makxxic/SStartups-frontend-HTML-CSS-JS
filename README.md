🌍 SStartups: Get Off Your Screen!

SStartups is a web project to inspire you to ditch your screens and explore the world. It features an OpenStreetMap-powered interactive map, a vibrant gallery, and an about/contact page.
📂 Project Structure
The project is organized for clarity and scalability:



Path
Description



/project-root
Root directory


├── /pages
Page-specific HTML files


│   ├── index.html
Home page with OpenStreetMap


│   ├── gallery.html
Gallery page for images


│   ├── about.html
About or contact page


│   └── ...
Additional pages as needed


├── /assets
Static assets


│   ├── /images
Pictures for pages or map


│   ├── /icons
UI or map marker icons


│   └── /css
CSS styles


│       ├── main.css
Global styles


│       ├── gallery.css
Gallery-specific styles


│       └── map.css
Map-related styles (markers, popups)


├── /js
JavaScript files


│   ├── main.js
Shared UI logic (e.g., nav toggles)


│   ├── map.js
OpenStreetMap logic (Leaflet.js)


│   ├── gallery.js
Gallery-specific scripts


│   ├── api.js
API calls for data fetching


│   ├── utils.js
Helper functions


│   └── router.js
Optional SPA routing


├── /data
Static data files


│   └── locations.json
JSON for map markers, image metadata


├── /components
Reusable UI components


│   ├── navbar.html
Navigation bar


│   ├── footer.html
Footer


│   └── markerPopup.js
Map popup component


├── /config
Configuration files


│   └── mapConfig.js
Map settings (tile server, defaults)


└── README.md
Project documentation


🎯 Purpose
SStartups encourages real-world exploration through:

Interactive Map: OpenStreetMap with Leaflet.js, featuring custom markers and popups.
Gallery: Stunning visuals to inspire adventure.
About/Contact: Project info and contact details.

🚀 Getting Started

Clone the Repo:
git clone <repository-url>
cd project-root


Add Dependencies:

Include Leaflet.js via CDN in HTML:<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>


Configure tile server in config/mapConfig.js.


Run Locally:

Start a server:python -m http.server 8000

or use VS Code’s Live Server.
Open http://localhost:8000/pages/index.html.


Customize:

Add images to assets/images/.
Update data/locations.json for map data.
Edit assets/css/ or js/ for customizations.



🛠️ Technologies

HTML5: Semantic structure.
CSS3: Responsive styling.
JavaScript: Dynamic functionality.
OpenStreetMap & Leaflet.js: Map integration.
JSON: Data storage for markers/metadata.

🌟 Features

Responsive design for all devices.
Modular, reusable components.
Easy to extend with new pages or features.

🤝 Contributing

Fork the repo.
Create a branch: git checkout -b feature/your-feature.
Commit: git commit -m "Add your feature".
Push: git push origin feature/your-feature.
Open a Pull Request.

Discuss major changes in an issue first.
📜 License
MIT License.
📬 Contact
Visit About page or open a GitHub issue.
Explore the world with SStartups! 🌏
