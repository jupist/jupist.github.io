// This file implements the functionality for the sideways scrolling carousel that displays the logos of technical skills. It manages the animation and scrolling behavior of the carousel.

const carousel = document.querySelector('.carousel');
const scrollAmount = 200; // Amount to scroll on each button click

document.querySelector('.carousel-button-left').addEventListener('click', () => {
    carousel.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth'
    });
});

document.querySelector('.carousel-button-right').addEventListener('click', () => {
    carousel.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
});

// Optional: Auto-scroll functionality
let autoScrollInterval = setInterval(() => {
    carousel.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
}, 3000); // Scroll every 3 seconds

// Pause auto-scroll on hover
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
        carousel.scrollBy({
            top: 0,
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, 3000);
});