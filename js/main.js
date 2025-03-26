// This file contains the main JavaScript functionality for the webpage. 
// It handles the loading animations, manages the navigation between sections, 
// and includes event listeners for user interactions.

document.addEventListener("DOMContentLoaded", function() {
    // Add loading animation
    const loader = document.getElementById('loader');
    loader.style.display = 'none'; // Hide loader after content is loaded

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});