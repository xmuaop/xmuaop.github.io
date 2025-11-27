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
    if (isActive()) { showBadge(); ensureEggsButton(); }

    profileImg.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
            if (!isActive()) {
                localStorage.setItem('achievementMode', 'on');
                showBadge();
                ensureEggsButton();
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
                removeEggsButtonAndPanel();
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

    // Easter eggs side button & panel
    function ensureEggsButton(){
        if (document.querySelector('.easter-eggs-button')) return;
        const btn = document.createElement('div');
        btn.className = 'easter-eggs-button';
        btn.innerHTML = '🥚 Eggs';
        btn.addEventListener('click', toggleEggsPanel);
        document.body.appendChild(btn);
    }

    function buildEggsPanel(){
        let panel = document.querySelector('.easter-eggs-panel');
        if (!panel){
            panel = document.createElement('div');
            panel.className = 'easter-eggs-panel';
            panel.innerHTML = `
                <h3>Hidden Eggs</h3>
                <div class="egg-list"></div>
                <button class="close-eggs-btn">Close</button>
            `;
            document.body.appendChild(panel);
            panel.querySelector('.close-eggs-btn').addEventListener('click', toggleEggsPanel);
        }
        // Populate list
        const list = panel.querySelector('.egg-list');
        list.innerHTML = '';
        const eggs = [
            { key: 'mode', name: 'Achievement Mode', desc: 'Unlock by clicking profile 5x', unlocked: isActive() },
            { key: 'polyglot', name: 'Polyglot', desc: '30 skill clicks', unlocked: localStorage.getItem('ach_polyglot') === 'unlocked' },
            { key: 'future1', name: '???', desc: 'Coming soon', unlocked: false }
        ];
        eggs.forEach(egg => {
            const div = document.createElement('div');
            div.className = 'egg-item ' + (egg.unlocked ? 'unlocked' : 'locked');
            div.innerHTML = `${egg.unlocked ? '✅' : '🔒'} <strong>${egg.name}</strong> <span style="opacity:.75">${egg.desc}</span>`;
            list.appendChild(div);
        });
        return panel;
    }

    function toggleEggsPanel(){
        const panel = buildEggsPanel();
        panel.classList.toggle('show');
    }

    function removeEggsButtonAndPanel(){
        const btn = document.querySelector('.easter-eggs-button');
        if (btn) btn.remove();
        const panel = document.querySelector('.easter-eggs-panel');
        if (panel) panel.remove();
    }
})();

// Settings functionality
function openSettings() {
    // Create overlay if doesn't exist
    let overlay = document.querySelector('.settings-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.innerHTML = `
            <div class="settings-panel">
                <div class="settings-header">
                    <h2>⚙️ Settings</h2>
                    <button class="settings-close" onclick="closeSettings()">×</button>
                </div>
                <div class="settings-tabs">
                    <button class="settings-tab active" onclick="switchSettingsTab('appearance')">Appearance</button>
                    <button class="settings-tab" onclick="switchSettingsTab('ease')">Ease</button>
                    <button class="settings-tab" onclick="switchSettingsTab('advanced')">Advanced</button>
                </div>
                <div class="settings-content">
                    <div class="settings-tab-content active" id="tab-appearance">
                        <div class="setting-item">
                            <label class="setting-label">Theme</label>
                            <div class="setting-description">Choose your preferred color theme</div>
                            <select id="theme-select">
                                <option value="default">Default (Green)</option>
                                <option value="blue">Blue</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">Language</label>
                            <div class="setting-description">Select your preferred language</div>
                            <select id="lang-select" onchange="changeLang(this.value)">
                                <option value="en">English</option>
                                <option value="fr">Français</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-tab-content" id="tab-ease">
                        <div class="setting-item">
                            <label class="setting-label">Animations</label>
                            <div class="setting-description">Enable or disable page animations</div>
                            <div class="checkbox-wrapper">
                                <input type="checkbox" id="animations-toggle" checked>
                                <label>Enable animations</label>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">Reduced Motion</label>
                            <div class="setting-description">Minimize movement for accessibility</div>
                            <div class="checkbox-wrapper">
                                <input type="checkbox" id="reduced-motion-toggle">
                                <label>Reduce motion</label>
                            </div>
                        </div>
                    </div>
                    <div class="settings-tab-content" id="tab-advanced">
                        <div class="setting-item">
                            <label class="setting-label">Achievement Mode</label>
                            <div class="setting-description">Current status: <strong>${localStorage.getItem('achievementMode') === 'on' ? 'Enabled' : 'Disabled'}</strong></div>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">Reset Data</label>
                            <div class="setting-description">Clear all achievements and progress</div>
                            <button class="setting-button danger" onclick="resetAchievements()">Reset Achievements</button>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">Clear All Data</label>
                            <div class="setting-description">Remove all stored preferences and data</div>
                            <button class="setting-button danger" onclick="clearAllData()">Clear All Data</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Set current language in dropdown
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        overlay.querySelector('#lang-select').value = currentLang;
        
        // Set current theme
        const currentTheme = localStorage.getItem('theme') || 'default';
        overlay.querySelector('#theme-select').value = currentTheme;
        overlay.querySelector('#theme-select').addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
        
        // Set animation preferences
        const animationsEnabled = localStorage.getItem('animations') !== 'disabled';
        overlay.querySelector('#animations-toggle').checked = animationsEnabled;
        overlay.querySelector('#animations-toggle').addEventListener('change', (e) => {
            toggleAnimations(e.target.checked);
        });
        
        const reducedMotion = localStorage.getItem('reducedMotion') === 'enabled';
        overlay.querySelector('#reduced-motion-toggle').checked = reducedMotion;
        overlay.querySelector('#reduced-motion-toggle').addEventListener('change', (e) => {
            toggleReducedMotion(e.target.checked);
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettings();
        });
    }
    
    // Show overlay
    setTimeout(() => overlay.classList.add('show'), 10);
}

function closeSettings() {
    const overlay = document.querySelector('.settings-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function switchSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function resetAchievements() {
    if (confirm('Are you sure you want to reset all achievements? This cannot be undone.')) {
        localStorage.removeItem('ach_skillClicks');
        localStorage.removeItem('ach_polyglot');
        localStorage.removeItem('achievementMode');
        localStorage.removeItem('achievementTutorialShown');
        alert('Achievements reset! Refresh the page.');
        closeSettings();
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This will reset everything including language preferences.')) {
        localStorage.clear();
        alert('All data cleared! The page will reload.');
        location.reload();
    }
}

// Theme management
function applyTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.classList.remove('dark-mode');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    // Add more themes here in the future
}

// Animation management
function toggleAnimations(enabled) {
    if (enabled) {
        localStorage.setItem('animations', 'enabled');
        document.body.classList.remove('no-animations');
    } else {
        localStorage.setItem('animations', 'disabled');
        document.body.classList.add('no-animations');
    }
}

function toggleReducedMotion(enabled) {
    if (enabled) {
        localStorage.setItem('reducedMotion', 'enabled');
        document.body.classList.add('no-animations');
    } else {
        localStorage.setItem('reducedMotion', 'disabled');
        document.body.classList.remove('no-animations');
    }
}

// Load preferences on page load
(function() {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'default';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Apply animation preferences
    const animationsDisabled = localStorage.getItem('animations') === 'disabled';
    const reducedMotion = localStorage.getItem('reducedMotion') === 'enabled';
    if (animationsDisabled || reducedMotion) {
        document.body.classList.add('no-animations');
    }
})();
