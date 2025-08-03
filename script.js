document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const playButton = document.getElementById('play-button');
    const audio = document.getElementById('lofi-song');

    // Audio Player Functionality
    function toggleAudio() {
        if (audio.paused) {
            audio.play().then(() => {
                playButton.innerHTML = "🎵 Now Playing...";
                playButton.classList.add('playing');
                createHeartBurst(5); // Celebration hearts
                if (Math.random() > 0.5) createConstellationHearts();
            }).catch(error => {
                console.error("Playback error:", error);
                alert("Playback blocked! Please interact with the page first.");
            });
        } else {
            audio.pause();
            playButton.textContent = "🎵 Click to Play the Song";
            playButton.classList.remove('playing');
        }
    }

    playButton.addEventListener('click', toggleAudio);
    
    // Handle audio ending (though it's set to loop)
    audio.addEventListener('ended', () => {
        playButton.textContent = "🎵 Click to Play the Song";
        playButton.classList.remove('playing');
    });

    // Floating Hearts Animation
    function createHeart(x = null, y = null) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.classList.add('heart');
        
        // If coordinates provided (from click/touch), use them
        if (x !== null && y !== null) {
            heart.style.left = `${x}px`;
            heart.style.bottom = `${window.innerHeight - y}px`;
        } else {
            // Random position at bottom of screen for auto-generated hearts
            heart.style.left = `${Math.random() * window.innerWidth}px`;
            heart.style.bottom = '0';
        }
        
        // Random size and animation duration
        const size = Math.random() * 0.8 + 0.4;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${Math.random() * 4 + 3}s`;
        
        // Random color from pastel palette
        const colors = ['#ff9a9e', '#fad0c4', '#fbc2eb', '#a6c1ee', '#ffb3ba'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.opacity = Math.random() * 0.6 + 0.4;
        
        document.body.appendChild(heart);
        
        // Auto-remove after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 6000);
    }

    function createHeartBurst(count, x = null, y = null) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => createHeart(x, y), i * 150);
        }
    }

    // Constellation Heart Effect
    function createConstellationHearts() {
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        document.body.appendChild(constellation);
        
        const heartCount = Math.floor(Math.random() * 5) + 8;
        for (let i = 0; i < heartCount; i++) {
            const star = document.createElement('div');
            star.className = 'constellation-heart';
            star.innerHTML = '❤️';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.fontSize = `${Math.random() * 0.8 + 0.4}rem`;
            star.style.opacity = Math.random() * 0.6 + 0.4;
            star.style.animationDelay = `${Math.random() * 2}s`;
            
            const colors = ['#ff9a9e', '#fad0c4', '#fbc2eb', '#a6c1ee', '#ffb3ba'];
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            constellation.appendChild(star);
        }
        
        setTimeout(() => constellation.remove(), 5000);
    }

    // Initialize auto hearts
    let heartInterval = setInterval(() => createHeart(), 1000);

    // Handle both mouse clicks and touch events
    function handleInteraction(e) {
        let x, y;
        
        if (e.type.includes('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        
        if (!['play-button', 'memory-video'].some(id => 
            e.target.id === id || e.target.closest(`#${id}`)
        )) {
            createHeartBurst(3, x, y);
            if (Math.random() > 0.7) createConstellationHearts();
        }
    }

    // Heart Trail Effect
    let lastHeartTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastHeartTime > 100) {
            lastHeartTime = now;
            if (Math.random() > 0.8) {
                createHeart(e.clientX, e.clientY);
            }
        }
    });

    // Special Celebration Mode
    let celebrationMode = false;
    function toggleCelebrationMode() {
        celebrationMode = !celebrationMode;
        if (celebrationMode) {
            clearInterval(heartInterval);
            heartInterval = setInterval(() => createHeartBurst(3), 300);
            document.body.classList.add('celebration-mode');
            createHeartBurst(10);
            createConstellationHearts();
        } else {
            clearInterval(heartInterval);
            heartInterval = setInterval(() => createHeart(), 1000);
            document.body.classList.remove('celebration-mode');
        }
    }

    // Secret activation (triple-click)
    let clickCount = 0;
    let lastClickTime = 0;
    document.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime > 500) clickCount = 0;
        clickCount++;
        lastClickTime = now;
        
        if (clickCount >= 3) {
            toggleCelebrationMode();
            clickCount = 0;
        }
    });

    // Add event listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    // Cleanup on page exit
    window.addEventListener('beforeunload', () => {
        clearInterval(heartInterval);
        if (!audio.paused) audio.pause();
    });

    // Initial effects
    createHeartBurst(5);
    setTimeout(createConstellationHearts, 2000);
});