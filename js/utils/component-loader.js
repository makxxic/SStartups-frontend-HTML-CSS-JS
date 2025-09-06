export function loadComponent(url, targetSelector) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const target = document.querySelector(targetSelector);
            if (target) target.innerHTML = html;
        });
}