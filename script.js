// Simple hover effect for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.background = '#e8eaf6';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.background = '#f8f9fa';
    });
});

// Log when page is loaded
console.log('Portfolio loaded! 🚀');

