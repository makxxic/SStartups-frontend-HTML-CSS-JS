// loader.js
// Modular and reusable loader utility

/**
 * Shows a loader overlay/spinner inside the target element.
 * @param {HTMLElement} targetElem - The element to overlay the loader on.
 * @param {Object} options - Optional settings (spinner size, color, etc.)
 */
export function showLoader(targetElem, options = {}) {
    if (!targetElem) return;
    let loader = document.createElement('div');
    loader.className = 'custom-loader-overlay';
    loader.innerHTML = `<div class="custom-loader-spinner" style="width:${options.size||40}px;height:${options.size||40}px;border:${options.thickness||4}px solid ${options.bgColor||'#f3f3f3'};border-top:${options.thickness||4}px solid ${options.color||'#3498db'};"></div>`;
    loader.style.position = 'absolute';
    loader.style.top = 0;
    loader.style.left = 0;
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.background = options.overlayBg || 'rgba(255,255,255,0.6)';
    loader.style.zIndex = 9999;
    loader.setAttribute('data-loader', 'true');
    targetElem.style.position = 'relative';
    targetElem.appendChild(loader);
}

/**
 * Removes the loader overlay/spinner from the target element.
 * @param {HTMLElement} targetElem - The element to remove the loader from.
 */
export function hideLoader(targetElem) {
    if (!targetElem) return;
    const loader = targetElem.querySelector('.custom-loader-overlay[data-loader="true"]');
    if (loader) loader.remove();
}

// Example CSS (add to your stylesheet):
// .custom-loader-spinner {
//   border-radius: 50%;
//   animation: spin 1s linear infinite;
// }
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
