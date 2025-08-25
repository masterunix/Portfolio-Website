class DSAHoneycomb {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.backBtn = document.getElementById('back-btn');
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
    }
    
    computeSizing() {
        // Match projects page hexagon sizing exactly
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Use exact same sizing logic as projects page
        const baseHexWidth = Math.floor(viewportWidth / 4.27); // Reduced by 25% from /3.2
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth;
        const spacingY = baseHexHeight * 0.75;

        // Allow hexagons to be larger, top/bottom rows can be cut off
        let scale = 1;
        // Remove height scaling to allow overflow

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        const gapPx = Math.floor(20 * scale); // Proportional gap
        this.hexSpacingX = this.hexWidth + gapPx;
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx;
    }

    typeHeaderText() {
        const headerElement = document.querySelector('#main-header h1');
        const text = "DSA Stats";
        headerElement.textContent = "";
        headerElement.style.borderRight = "3px solid white";
        headerElement.style.animation = "blink-cursor 0.75s step-end infinite";
        
        let i = 0;
        const typeChar = () => {
            if (i < text.length) {
                headerElement.textContent = text.substring(0, i + 1);
                i++;
                setTimeout(typeChar, 50); // 50ms per character like homepage
            }
        };
        
        typeChar();
    }

    init() {
        this.typeHeaderText();
        this.generateDSAHoneycomb();
        this.setupEventListeners();
        
        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateDSAHoneycomb();
            }, 150);
        });
    }

    generateDSAHoneycomb() {
        // Create 3-row honeycomb structure with proper pattern
        const rows = 3;
        
        // Calculate starting position to center the middle row (row 1)
        // Account for the middle row being offset by half spacing to the right
        const evenRowWidth = (4 - 1) * this.hexSpacingX + this.hexWidth;
        const gridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startX = (window.innerWidth - evenRowWidth) / 2 - this.hexSpacingX / 2;
        const startY = (window.innerHeight - gridHeight) / 2;
        
        this.container.innerHTML = '';
        
        for (let row = 0; row < rows; row++) {
            // Row 0 and 2 have 5 hexagons (0-4), Row 1 has 4 hexagons (0-3)
            const colsInRow = (row === 1) ? 4 : 5;
            
            for (let col = 0; col < colsInRow; col++) {
                const hex = this.createDSAHex(row, col, startX, startY);
                // Start hexagons hidden to prevent flash before animation
                hex.style.opacity = '0';
                hex.style.transform = 'translateY(20px)';
                this.container.appendChild(hex);
            }
        }
    }

    createDSAHex(row, col, startX, startY) {
        const hex = document.createElement('div');
        hex.className = 'hex';
        
        // Use proper honeycomb positioning - odd rows offset by half spacing
        const offsetX = (row % 2 === 1) ? this.hexSpacingX / 2 : 0;
        const x = startX + col * this.hexSpacingX + offsetX;
        const y = startY + row * this.hexSpacingY;
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.style.width = this.hexWidth + 'px';
        hex.style.height = this.hexHeight + 'px';

        // Add SVG hex
        const svg = this.createSVGHex(this.hexWidth, this.hexHeight);
        hex.appendChild(svg);
        
        // Create hexagon content with DSA data
        const hexContent = document.createElement('div');
        hexContent.className = 'hex-content';
        
        const hexId = `${row}-${col}`;
        hex.setAttribute('data-hex-id', hexId);
        
        // Add content based on row and column
        this.addDSAContent(hexContent, row, col);
        
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

    addDSAContent(hexContent, row, col) {
        if (row === 1) {
            // Middle row - coding platforms
            const platforms = [
                {
                    name: 'Codeforces',
                    logoPath: 'Assets/Logos/codeforces.png',
                    url: 'https://codeforces.com/profile/resident-evil',
                    color: '#1f8dd6'
                },
                {
                    name: 'LeetCode',
                    logoPath: 'Assets/Logos/leetcode.png',
                    url: 'https://leetcode.com/u/vatsalgoyal/',
                    color: '#ffa116'
                },
                {
                    name: 'HackerRank',
                    logoPath: 'Assets/Logos/hackerank.png',
                    url: 'https://www.hackerrank.com/profile/goyalvatsal',
                    color: '#00ea64'
                },
                {
                    name: 'AtCoder',
                    logoPath: 'Assets/Logos/atcoder.png',
                    url: 'https://atcoder.jp/users/vatsalgoyal',
                    color: '#3f51b5'
                }
            ];
            
            const platform = platforms[col];
            
            // Create platform icon with actual logo
            const platformIcon = document.createElement('div');
            platformIcon.className = 'dsa-icon';
            platformIcon.style.background = `linear-gradient(135deg, ${platform.color} 0%, ${this.adjustColor(platform.color, -20)} 100%)`;
            platformIcon.style.cursor = 'pointer';
            platformIcon.style.width = '50px';
            platformIcon.style.height = '50px';
            platformIcon.style.borderRadius = '12px';
            platformIcon.style.display = 'flex';
            platformIcon.style.alignItems = 'center';
            platformIcon.style.justifyContent = 'center';
            
            const logoImg = document.createElement('img');
            logoImg.src = platform.logoPath;
            logoImg.style.width = '30px';
            logoImg.style.height = '30px';
            logoImg.style.objectFit = 'contain';
            logoImg.alt = platform.name;
            platformIcon.appendChild(logoImg);
            
            // Create platform name
            const platformName = document.createElement('div');
            platformName.className = 'dsa-title';
            platformName.textContent = platform.name;
            platformName.style.fontSize = '14px';
            platformName.style.fontWeight = '700';
            platformName.style.marginBottom = '4px';
            
            // Create languages text
            const languagesText = document.createElement('div');
            languagesText.className = 'dsa-value';
            languagesText.textContent = 'DSA Languages';
            languagesText.style.fontSize = '12px';
            languagesText.style.marginBottom = '3px';
            languagesText.style.fontWeight = '600';
            
            // Create languages list
            const languagesList = document.createElement('div');
            languagesList.className = 'dsa-description';
            languagesList.textContent = 'Python, C, C++';
            languagesList.style.fontSize = '10px';
            languagesList.style.marginBottom = '6px';
            languagesList.style.opacity = '0.9';
            
            // Create visit button
            const visitButton = document.createElement('button');
            visitButton.className = 'visit-btn';
            visitButton.textContent = 'Visit Profile';
            visitButton.style.cssText = `
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                margin-top: 2px;
            `;
            
            visitButton.addEventListener('mouseenter', () => {
                visitButton.style.transform = 'scale(1.05)';
                visitButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });
            
            visitButton.addEventListener('mouseleave', () => {
                visitButton.style.transform = 'scale(1)';
                visitButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            });
            
            visitButton.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(platform.url, '_blank');
            });
            
            // Add click handler for platform link (fallback)
            hexContent.style.cursor = 'pointer';
            hexContent.addEventListener('click', () => {
                window.open(platform.url, '_blank');
            });
            
            hexContent.appendChild(platformIcon);
            hexContent.appendChild(platformName);
            hexContent.appendChild(languagesText);
            hexContent.appendChild(languagesList);
            hexContent.appendChild(visitButton);
            
        } else {
            // Other rows - DSA concepts
            const dsaConcepts = [
                // Row 0 concepts
                { title: 'Arrays', icon: '📊', description: 'Linear data structures', color: '#3498db' },
                { title: 'Linked Lists', icon: '🔗', description: 'Dynamic data structures', color: '#9b59b6' },
                { title: 'Stacks', icon: '📚', description: 'LIFO data structure', color: '#e74c3c' },
                { title: 'Queues', icon: '🚶', description: 'FIFO data structure', color: '#f39c12' },
                { title: 'Trees', icon: '🌳', description: 'Hierarchical structures', color: '#27ae60' },
                // Row 2 concepts  
                { title: 'Graphs', icon: '🕸️', description: 'Network structures', color: '#2c3e50' },
                { title: 'Hashing', icon: '#️⃣', description: 'Key-value mapping', color: '#8e44ad' },
                { title: 'Sorting', icon: '🔢', description: 'Ordering algorithms', color: '#d35400' },
                { title: 'Searching', icon: '🔍', description: 'Finding algorithms', color: '#16a085' },
                { title: 'Dynamic Programming', icon: '🧮', description: 'Optimization technique', color: '#c0392b' }
            ];
            
            const conceptIndex = row === 0 ? col : (col + 5);
            const concept = dsaConcepts[conceptIndex];
            
            if (concept) {
                // Create concept icon
                const conceptIcon = document.createElement('div');
                conceptIcon.className = 'dsa-icon';
                conceptIcon.textContent = concept.icon;
                conceptIcon.style.background = `linear-gradient(135deg, ${concept.color} 0%, ${this.adjustColor(concept.color, -20)} 100%)`;
                conceptIcon.style.width = '45px';
                conceptIcon.style.height = '45px';
                conceptIcon.style.borderRadius = '12px';
                conceptIcon.style.display = 'flex';
                conceptIcon.style.alignItems = 'center';
                conceptIcon.style.justifyContent = 'center';
                conceptIcon.style.fontSize = '20px';
                conceptIcon.style.marginBottom = '8px';
                
                // Create concept title
                const conceptTitle = document.createElement('div');
                conceptTitle.className = 'dsa-title';
                conceptTitle.textContent = concept.title;
                conceptTitle.style.fontSize = '13px';
                conceptTitle.style.fontWeight = '700';
                conceptTitle.style.marginBottom = '4px';
                conceptTitle.style.textAlign = 'center';
                
                // Create concept description
                const conceptDescription = document.createElement('div');
                conceptDescription.className = 'dsa-description';
                conceptDescription.textContent = concept.description;
                conceptDescription.style.fontSize = '9px';
                conceptDescription.style.opacity = '0.8';
                conceptDescription.style.textAlign = 'center';
                conceptDescription.style.lineHeight = '1.2';
                
                hexContent.appendChild(conceptIcon);
                hexContent.appendChild(conceptTitle);
                hexContent.appendChild(conceptDescription);
            }
        }
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

        // Back button functionality
        this.backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    zoomHexagon(hex, isZooming) {
        if (isZooming) {
            hex.style.setProperty('transform', 'scale(1.05)', 'important');
            hex.style.setProperty('z-index', '10', 'important');
            hex.style.setProperty('filter', 'brightness(1.2)', 'important');
        } else {
            hex.style.setProperty('transform', 'scale(1)', 'important');
            hex.style.setProperty('z-index', '1', 'important');
            hex.style.setProperty('filter', 'brightness(1)', 'important');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DSAHoneycomb();
});

// Fast entrance animation
window.addEventListener('load', () => {
    const hexagons = document.querySelectorAll('.hex');
    
    hexagons.forEach((hex, index) => {
        hex.style.opacity = '0';
        hex.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            hex.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            hex.style.opacity = '1';
            hex.style.transform = 'translateY(0)';
        }, index * 50);
    });
});
