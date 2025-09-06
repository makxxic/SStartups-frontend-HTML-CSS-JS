import { loadComponent } from './utils/component-loader.js';

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('../components/topnavbar.html', '#navbar');
    loadComponent('../components/footer.html', '#footer');
});