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
        
        // Navigation hexagons with official logos and descriptions
        const navigationContent = {
            '1-2': { 
                text: 'Github', 
                description: 'View my code repositories',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>',
                color: '#333333' 
            },
            '1-3': { 
                text: 'Live Projects', 
                description: 'Explore my portfolio',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/></svg>',
                color: '#667eea' 
            },
            '1-4': { 
                text: 'LinkedIn', 
                description: 'Connect professionally',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                color: '#0077b5' 
            },
            '2-2': { 
                text: 'Download Resume', 
                description: 'Get my latest CV',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
                color: '#34a853' 
            },
            '2-3': { 
                text: 'Skills & Journey', 
                description: 'My tech stack & career',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/></svg>',
                color: '#ff6b6b' 
            },
            '2-4': { 
                text: 'DSA Stats', 
                description: 'Coding achievements',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>',
                color: '#4ecdc4' 
            },
            '2-5': { 
                text: 'Mail Me!', 
                description: 'Let\'s get in touch',
                logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>',
                color: '#feca57' 
            }
        };
        
        if (navigationContent[hexId]) {
            const navItem = navigationContent[hexId];
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'hex-icon';
            iconDiv.innerHTML = navItem.logo;
            iconDiv.style.background = `linear-gradient(135deg, ${navItem.color} 0%, ${this.adjustColor(navItem.color, -20)} 100%)`;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'hex-text';
            textSpan.textContent = navItem.text;
            
            const descSpan = document.createElement('span');
            descSpan.className = 'hex-description';
            descSpan.textContent = navItem.description;
            
            hexContent.appendChild(iconDiv);
            hexContent.appendChild(textSpan);
            hexContent.appendChild(descSpan);
            hex.classList.add('nav-hex');
        }
        // Leave other hexagons empty (no ID labels)
        
        hex.appendChild(hexContent);
        
        // Add fast entrance animation
        hex.style.opacity = '0';
        hex.style.animation = `fadeInUp 0.15s ease-out forwards`;
        hex.style.animationDelay = `${(row * 9 + col) * 8}ms`; // 8ms stagger
        
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
                let targetUrl = null;
                
                switch(hexId) {
                    case '1-3': // Live Projects
                        targetUrl = 'projects.html';
                        break;
                    case '2-3': // Skills & Journey
                        targetUrl = 'skills.html';
                        break;
                    case '2-4': // DSA Stats
                        targetUrl = 'dsa.html';
                        break;
                    case '1-2': // GitHub
                        this.handleGitHubClick(hex);
                        return;
                    case '1-2-copy': // GitHub copy mode
                        this.copyGitHubLink();
                        return;
                    case '1-4': // LinkedIn
                        this.handleLinkedInClick(hex);
                        return;
                    case '1-4-copy': // LinkedIn copy mode
                        this.copyLinkedInLink();
                        return;
                }
                
                if (targetUrl) {
                    this.animatePageTransition(targetUrl);
                }
            }
        });
    }
    
    handleGitHubClick(hex) {
        // Open GitHub profile
        window.open('https://github.com/masterunix', '_blank');
        
        // Update hexagon content - only change description and add copy icon below
        const hexContent = hex.querySelector('.hex-content');
        const descSpan = hexContent.querySelector('.hex-description');
        
        // Change description text
        descSpan.textContent = 'Profile opened in another tab. Try again?';
        
        // Add copy icon below the description
        const copyIcon = document.createElement('img');
        copyIcon.src = 'https://cdn-icons-png.flaticon.com/512/54/54702.png';
        copyIcon.style.cssText = `
            width: 16px;
            height: 16px;
            margin-top: 4px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;
        copyIcon.className = 'copy-icon';
        copyIcon.onmouseover = () => copyIcon.style.opacity = '1';
        copyIcon.onmouseout = () => copyIcon.style.opacity = '0.8';
        
        hexContent.appendChild(copyIcon);
        
        // Change hex ID to indicate copy mode
        hex.setAttribute('data-hex-id', '1-2-copy');
        
        // Reset after 5 seconds
        setTimeout(() => {
            descSpan.textContent = 'View my code repositories';
            const existingIcon = hexContent.querySelector('.copy-icon');
            if (existingIcon) {
                existingIcon.remove();
            }
            hex.setAttribute('data-hex-id', '1-2');
        }, 5000);
    }

    handleLinkedInClick(hex) {
        // Open LinkedIn profile
        window.open('https://www.linkedin.com/in/vatsal-goyal-05a896165', '_blank');
        
        // Update hexagon content - only change description and add copy icon below
        const hexContent = hex.querySelector('.hex-content');
        const descSpan = hexContent.querySelector('.hex-description');
        
        // Change description text
        descSpan.textContent = 'Profile opened in another tab. Try again?';
        
        // Add copy icon below the description
        const copyIcon = document.createElement('img');
        copyIcon.src = 'https://cdn-icons-png.flaticon.com/512/54/54702.png';
        copyIcon.style.cssText = `
            width: 16px;
            height: 16px;
            margin-top: 4px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;
        copyIcon.className = 'copy-icon';
        copyIcon.onmouseover = () => copyIcon.style.opacity = '1';
        copyIcon.onmouseout = () => copyIcon.style.opacity = '0.8';
        
        hexContent.appendChild(copyIcon);
        
        // Change hex ID to indicate copy mode
        hex.setAttribute('data-hex-id', '1-4-copy');
        
        // Reset after 5 seconds
        setTimeout(() => {
            descSpan.textContent = 'Connect professionally';
            const existingIcon = hexContent.querySelector('.copy-icon');
            if (existingIcon) {
                existingIcon.remove();
            }
            hex.setAttribute('data-hex-id', '1-4');
        }, 5000);
    }
    
    copyGitHubLink() {
        const gitHubUrl = 'https://github.com/masterunix';
        
        // Copy to clipboard
        navigator.clipboard.writeText(gitHubUrl).then(() => {
            // Show success feedback
            const hex = document.querySelector('[data-hex-id="1-2-copy"]');
            const descSpan = hex.querySelector('.hex-description');
            descSpan.textContent = 'Link copied to clipboard!';
            descSpan.style.color = '#4CAF50';
            
            // Reset color after 2 seconds
            setTimeout(() => {
                descSpan.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = gitHubUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            const hex = document.querySelector('[data-hex-id="1-2-copy"]');
            const descSpan = hex.querySelector('.hex-description');
            descSpan.textContent = 'Link copied to clipboard!';
            descSpan.style.color = '#4CAF50';
            
            // Reset color after 2 seconds
            setTimeout(() => {
                descSpan.style.color = '';
            }, 2000);
        });
    }

    copyLinkedInLink() {
        const linkedInUrl = 'https://www.linkedin.com/in/vatsal-goyal-05a896165';
        
        // Copy to clipboard
        navigator.clipboard.writeText(linkedInUrl).then(() => {
            // Show success feedback
            const hex = document.querySelector('[data-hex-id="1-4-copy"]');
            const descSpan = hex.querySelector('.hex-description');
            descSpan.textContent = 'Link copied to clipboard!';
            descSpan.style.color = '#4CAF50';
            
            // Reset color after 2 seconds
            setTimeout(() => {
                descSpan.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = linkedInUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            const hex = document.querySelector('[data-hex-id="1-4-copy"]');
            const descSpan = hex.querySelector('.hex-description');
            descSpan.textContent = 'Link copied to clipboard!';
            descSpan.style.color = '#4CAF50';
            
            // Reset color after 2 seconds
            setTimeout(() => {
                descSpan.style.color = '';
            }, 2000);
        });
    }

    animatePageTransition(targetUrl) {
        const hexagons = this.container.querySelectorAll('.hex');
        hexagons.forEach((hex, index) => {
            setTimeout(() => {
                hex.style.animation = 'fadeOutDown 0.15s ease-in forwards';
            }, index * 8); // Very quick stagger (8ms between each)
        });
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = targetUrl;
        }, hexagons.length * 8 + 150); // Total animation time + buffer
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
