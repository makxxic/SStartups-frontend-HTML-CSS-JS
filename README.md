# SStartups-frontend-HTML-CSS-JS
a project on getting people off screen

Suggested folder sturcture
/project-root
│
├── /pages
│   ├── index.html           # Home page (Google Map maybe here)
│   ├── gallery.html         # Gallery page
│   ├── about.html           # About or contact page
│   └── ...                  # Any other pages
│
├── /assets
│   ├── /images              # Pictures used across pages or on the map
│   ├── /icons               # UI or marker icons
│   └── /css
│       ├── main.css         # Global styles
│       ├── gallery.css      # Page-specific or section-specific styles
│       └── map.css          # Styles related to the map (marker cards, popups, etc.)
│
├── /js
│   ├── main.js              # Common scripts (nav toggles, shared UI logic)
│   ├── map.js               # Google Maps API logic
│   ├── gallery.js           # Scripts specific to gallery page
│   ├── api.js               # API calls (fetching image/marker data, etc.)
│   ├── utils.js             # Helper functions
│   └── router.js            # Optional: for SPA-like behavior (if needed)
│
├── /data
│   └── locations.json       # Static JSON data for markers, image metadata, etc.
│
├── /components              # Reusable UI elements (can be HTML/JS)
│   ├── navbar.html
│   ├── footer.html
│   └── markerPopup.js
│
├── /config
│   └── mapConfig.js         # Map-related config like API key, default location, etc.
│
└── README.md
