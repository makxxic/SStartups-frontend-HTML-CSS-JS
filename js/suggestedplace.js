// Gallery and modal logic placeholder
window.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery-square');
    if (gallery) {
        gallery.innerHTML = '<img src="https://placehold.co/100x100" alt="Sample" />';
    }
    // Modal logic can be added here
});
function openModal(src, alt) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    modal.style.display = 'flex';
    modalImg.src = src;
    captionText.innerHTML = alt;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside the image
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});