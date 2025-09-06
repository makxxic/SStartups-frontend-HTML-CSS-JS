import { loadComponent } from './utils/component-loader.js';

const componentsToLoad = [
    { url: '../components/topnavbar.html', selector: '#navbar' },
    { url: '../components/footer.html', selector: '#footer' }
    // Add more components here as needed
];

document.addEventListener('DOMContentLoaded', () => {
    componentsToLoad.forEach(component => {
        loadComponent(component.url, component.selector);
    });
});