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

// Skill percentage tooltip
(function(){
    const createTooltip = (text, percent, x, y) => {
        const tip = document.createElement('div');
        tip.className = 'skill-tooltip';
        tip.style.left = `${x + 12}px`;
        tip.style.top = `${y + 12}px`;
        tip.innerHTML = `
            <div>${text}: ${percent}%</div>
            <div class="bar"><div class="bar-fill" style="width:${percent}%"></div></div>
        `;
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 2000);
    };

    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const skill = card.getAttribute('data-skill');
            const percent = parseInt(card.getAttribute('data-percent'), 10) || 0;
            createTooltip(skill, percent, e.clientX, e.clientY);
        });
    });
})();

