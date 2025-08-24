class HoneycombWebsite {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.zoomOverlay = document.getElementById('zoom-overlay');
        this.zoomContainer = document.getElementById('zoom-honeycomb-container');
        this.closeBtn = document.getElementById('close-zoom');
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
    }
    
    computeSizing() {
        // Calculate hexagon size to fill viewport with 6x9 grid
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Optimal hexagon size
        const baseHexWidth = Math.floor(viewportWidth / 5.69); // Reduced by 25% from /4.27
        // Pointy-top regular hex height/width ratio ≈ 2 / sqrt(3) ≈ 1.1547
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth; // column center distance for pointy-top
        const spacingY = baseHexHeight * 0.75; // row center distance

        // Compute base grid size
        const rows = 6, cols = 9;
        const gridWidth = (cols - 1) * spacingX + baseHexWidth;
        const gridHeight = (rows - 1) * spacingY + baseHexHeight;

        // Allow larger hexagons, some may extend beyond viewport
        let scale = 1;

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        // Pointy-top hex grid spacing
        // Adjacent column center distance = full hex width; odd rows offset by half-width
        // Adjacent row center distance = 0.75 * hex height
        // Add ~0.5 cm spacing between hexagons (CSS 1cm ≈ 37.8px, so 0.5cm ≈ 18.9px)
        const gapPx = 19; // half-centimeter visual gap
        this.hexSpacingX = this.hexWidth + gapPx; // horizontal center distance
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx; // vertical center distance
    }

    init() {
        this.generateMainHoneycomb();
        this.setupEventListeners();
        
        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateMainHoneycomb();
            }, 150);
        });
    }
    
    generateMainHoneycomb() {
        // Use DocumentFragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();
        
        // Create 4x8 grid (4 rows, 8 columns for two extra hexagons on left)
        const rows = 4;
        const cols = 8;
        
        // Calculate starting position to fill the screen
        const gridWidth = (cols - 1) * this.hexSpacingX + this.hexWidth;
        const gridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startX = (window.innerWidth - gridWidth) / 2;
        const startY = (window.innerHeight - gridHeight) / 2;
        
        // Generate hexagon grid with exclusions
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Skip specific hexagons for better performance
                if (this.shouldSkipHexagon(row, col)) {
                    continue;
                }
                const hex = this.createHexagon(row, col, startX, startY);
                fragment.appendChild(hex);
            }
        }
        
        // Clear and append all at once
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
    
    createHexagon(row, col, startX, startY) {
        const hex = document.createElement('div');
        hex.className = 'hex';
        
        // Calculate position for tessellation with proper offset
        const offsetX = (row % 2 === 1) ? this.hexSpacingX / 2 : 0;
        const x = startX + col * this.hexSpacingX + offsetX;
        const y = startY + row * this.hexSpacingY;
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.style.width = this.hexWidth + 'px';
        hex.style.height = this.hexHeight + 'px';

        // Add SVG hex with rounded corners
        const svg = this.createSVGHex(this.hexWidth, this.hexHeight);
        hex.appendChild(svg);
        
        // Create hexagon content
        const hexContent = document.createElement('div');
        hexContent.className = 'hex-content';
        
        // Add development IDs for reference
        const hexId = `${row}-${col}`;
        hex.setAttribute('data-hex-id', hexId);
        
        // Navigation hexagons with emoji icons and text
        const navigationContent = {
            '1-2': { text: 'Github', icon: '🐙', color: '#333333' },
            '1-3': { text: 'Live Projects', icon: '🚀', color: '#667eea' },
            '1-4': { text: 'LinkedIn', icon: '💼', color: '#0077b5' },
            '2-2': { text: 'Download Resume', icon: '📄', color: '#34a853' },
            '2-3': { text: 'Skills & Journey', icon: '🎯', color: '#ff6b6b' },
            '2-4': { text: 'DSA Stats', icon: '📊', color: '#4ecdc4' },
            '2-5': { text: 'Mail Me!', icon: '✉️', color: '#feca57' }
        };
        
        if (navigationContent[hexId]) {
            const navItem = navigationContent[hexId];
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'hex-icon';
            iconDiv.textContent = navItem.icon;
            iconDiv.style.background = `linear-gradient(135deg, ${navItem.color} 0%, ${this.adjustColor(navItem.color, -20)} 100%)`;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'hex-text';
            textSpan.textContent = navItem.text;
            
            hexContent.appendChild(iconDiv);
            hexContent.appendChild(textSpan);
            hex.classList.add('nav-hex');
        }
        // Leave other hexagons empty (no ID labels)
        
        hex.appendChild(hexContent);
        
        return hex;
    }

    createSVGHex(width, height) {
        // Reuse SVG template for better performance
        if (!this.svgTemplate) {
            const ns = 'http://www.w3.org/2000/svg';
            this.svgTemplate = document.createElementNS(ns, 'svg');
            this.svgTemplate.setAttribute('viewBox', '0 0 190 212');
            this.svgTemplate.setAttribute('preserveAspectRatio', 'none');

            const path = document.createElementNS(ns, 'path');
            const d = 'M85.5 3.63965C91.3786 0.245625 98.6214 0.245625 104.5 3.63965L178.896 46.5928C184.775 49.9868 188.396 56.2589 188.396 63.0469V148.953C188.396 155.741 184.775 162.013 178.896 165.407L104.5 208.36C98.805 211.648 91.8296 211.751 86.0547 208.669L85.5 208.36L11.1035 165.407C5.22494 162.013 1.60356 155.741 1.60352 148.953V63.0469C1.60356 56.2589 5.22493 49.9868 11.1035 46.5928L85.5 3.63965Z';
            path.setAttribute('d', d);
            this.svgTemplate.appendChild(path);
        }
        
        return this.svgTemplate.cloneNode(true);
    }
    
    shouldSkipHexagon(row, col) {
        // Remove corner hexagons and edge hexagons for better performance
        const skipList = [
            [0, 0], [2, 0], [0, 7], [2, 7], // corners
            [1, 7], [3, 7] // right edge after 1-6, 3-6
        ];
        
        return skipList.some(([r, c]) => r === row && c === col);
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    // Icon creation method removed - will be added later
    
    // Removed click functionality - will be designed later
    
    setupEventListeners() {
        // Add hover zoom functionality with mouseover/mouseout
        this.container.addEventListener('mouseover', (e) => {
            const hex = e.target.closest('.hex');
            if (hex && !hex.classList.contains('zoomed')) {
                hex.classList.add('zoomed');
                this.zoomHexagon(hex, true);
            }
        });
        
        this.container.addEventListener('mouseout', (e) => {
            const hex = e.target.closest('.hex');
            if (hex && hex.classList.contains('zoomed')) {
                hex.classList.remove('zoomed');
                this.zoomHexagon(hex, false);
            }
        });

        // Add click handlers for navigation hexagons
        this.container.addEventListener('click', (e) => {
            const hex = e.target.closest('.hex');
            if (hex) {
                const hexId = hex.getAttribute('data-hex-id');
                switch(hexId) {
                    case '1-3': // Live Projects
                        window.location.href = 'projects.html';
                        break;
                    case '2-3': // Skills & Journey
                        window.location.href = 'skills.html';
                        break;
                    case '2-4': // DSA Stats
                        window.location.href = 'dsa.html';
                        break;
                }
            }
        });
    }
    
    zoomHexagon(hex, isZooming) {
        if (isZooming) {
            hex.style.setProperty('transform', 'scale(1.035)', 'important');
            hex.style.setProperty('z-index', '10', 'important');
            hex.style.setProperty('filter', 'brightness(1.2)', 'important');
        } else {
            hex.style.setProperty('transform', 'scale(1)', 'important');
            hex.style.setProperty('z-index', '1', 'important');
            hex.style.setProperty('filter', 'brightness(1)', 'important');
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HoneycombWebsite');
    try {
        new HoneycombWebsite();
        console.log('HoneycombWebsite initialized successfully');
    } catch (error) {
        console.error('Error initializing HoneycombWebsite:', error);
    }
});

// Optimized entrance animation
window.addEventListener('load', () => {
    const hexagons = document.querySelectorAll('.hex');
    
    // Use CSS animation instead of JavaScript timeouts
    hexagons.forEach((hex, index) => {
        hex.style.animationDelay = `${index * 50}ms`;
        hex.classList.add('fade-in');
    });
});
