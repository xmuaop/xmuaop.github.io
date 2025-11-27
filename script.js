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

// Easter egg: enable Achievement Mode by clicking profile photo 5 times
(function(){
    const profileImg = document.querySelector('.profile-photo img');
    if (!profileImg) return;

    let clickCount = 0;
    const isActive = () => localStorage.getItem('achievementMode') === 'on';

    const showBadge = () => {
        if (document.querySelector('.achievement-badge')) return;
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.textContent = 'Achievement Mode ON';
        document.body.appendChild(badge);
    };

    const hideBadge = () => {
        const badge = document.querySelector('.achievement-badge');
        if (badge) badge.remove();
    };

    const ensureContainer = () => {
        let cont = document.querySelector('.achievement-container');
        if (!cont) {
            cont = document.createElement('div');
            cont.className = 'achievement-container';
            document.body.appendChild(cont);
        }
        return cont;
    };

    const toast = (text) => {
        const cont = ensureContainer();
        const t = document.createElement('div');
        t.className = 'achievement-toast';
        t.textContent = text;
        cont.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 250);
        }, 2500);
    };

    // initialize badge if active
    if (isActive()) showBadge();

    profileImg.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
            if (!isActive()) {
                localStorage.setItem('achievementMode', 'on');
                showBadge();
                toast('Easter Egg Found: Achievement Mode Enabled');
                clickCount = 0;
                // Show tutorial only first enable
                if (!localStorage.getItem('achievementTutorialShown')) {
                    localStorage.setItem('achievementTutorialShown', 'yes');
                    showTutorial();
                }
            } else {
                localStorage.setItem('achievementMode', 'off');
                hideBadge();
                toast('Achievement Mode Disabled');
                clickCount = 0;
            }
        }
    });

    // Track actions when in achievement mode
    const incCounter = (key) => {
        const totalKey = `ach_${key}`;
        const val = parseInt(localStorage.getItem(totalKey) || '0', 10) + 1;
        localStorage.setItem(totalKey, String(val));
        return val;
    };

    // Example achievement: Polyglot — click 30 skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!isActive()) return;
            const count = incCounter('skillClicks');
            if (count === 30) {
                toast('Achievement Unlocked: Polyglot (30 skill clicks)');
                // mark unlocked
                localStorage.setItem('ach_polyglot', 'unlocked');
            }
        });
    });

    // Tutorial modal implementation
    function showTutorial(){
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-card">
                <div class="tutorial-header">Achievement Mode Tutorial</div>
                <div class="tutorial-body">
                    <div>• Top-right popups show unlocked achievements.</div>
                    <div>• Click programming language cards to progress skills.</div>
                    <div>• Example: unlock <b>Polyglot</b> after 30 skill clicks.</div>
                    <div>• Click your profile photo 5 times again to disable.</div>
                </div>
                <div class="tutorial-actions">
                    <button class="btn btn-secondary" id="tutorialLater">Later</button>
                    <button class="btn btn-primary" id="tutorialGotIt">Got it</button>
                </div>
            </div>`;

        document.body.appendChild(overlay);
        const cleanup = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup();
        });
        overlay.querySelector('#tutorialLater').addEventListener('click', cleanup);
        overlay.querySelector('#tutorialGotIt').addEventListener('click', cleanup);
    }
})();

