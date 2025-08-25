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
        // Calculate hexagon size to fill viewport with 4x6 grid
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Optimal hexagon size
        const baseHexWidth = Math.floor(viewportWidth / 5.69);
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth;
        const spacingY = baseHexHeight * 0.75;

        // Compute base grid size
        const rows = 4, cols = 6;
        const gridWidth = (cols - 1) * spacingX + baseHexWidth;
        const gridHeight = (rows - 1) * spacingY + baseHexHeight;

        let scale = 1;

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        const gapPx = 19;
        this.hexSpacingX = this.hexWidth + gapPx;
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx;
    }

    init() {
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
        this.container.innerHTML = '';
        
        const rows = 4;
        const cols = 6;
        
        // Calculate starting position to center the grid
        const totalGridWidth = (cols - 1) * this.hexSpacingX + this.hexWidth;
        const totalGridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startX = (window.innerWidth - totalGridWidth) / 2;
        const startY = (window.innerHeight - totalGridHeight) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const hex = this.createDSAHex(row, col, startX, startY);
                this.container.appendChild(hex);
            }
        }
    }

    createDSAHex(row, col, startX, startY) {
        const hex = document.createElement('div');
        hex.className = 'hex';
        
        // Calculate position with offset for odd rows
        const x = startX + col * this.hexSpacingX + (row % 2) * (this.hexSpacingX / 2);
        const y = startY + row * this.hexSpacingY;
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.style.width = this.hexWidth + 'px';
        hex.style.height = this.hexHeight + 'px';

        // Add SVG hex
        const svg = this.createSVGHex(this.hexWidth, this.hexHeight);
        hex.appendChild(svg);
        
        // Create hexagon content
        const hexContent = document.createElement('div');
        hexContent.className = 'hex-content';
        
        const hexId = `${row}-${col}`;
        hex.setAttribute('data-hex-id', hexId);
        
        // DSA content data
        const dsaContent = {
            '0-0': { title: 'LeetCode', value: '450+', description: 'Problems solved', icon: '🔥', color: '#ff6b35' },
            '0-1': { title: 'Contest Rating', value: '1847', description: 'Peak rating', icon: '🏆', color: '#ffa726' },
            '0-2': { title: 'CodeChef', value: '3★', description: 'Star rating', icon: '⭐', color: '#66bb6a' },
            '0-3': { title: 'HackerRank', value: '5★', description: 'Gold badges', icon: '🥇', color: '#ffd54f' },
            '0-4': { title: 'Global Rank', value: 'Top 5%', description: 'Competitive coding', icon: '🌍', color: '#42a5f5' },
            '0-5': { title: 'Streak', value: '120+', description: 'Days active', icon: '⚡', color: '#ab47bc' },
            
            '1-0': { title: 'Easy', value: '200+', description: 'Problems solved', icon: '🟢', color: '#4caf50', progress: 85 },
            '1-1': { title: 'Medium', value: '180+', description: 'Problems solved', icon: '🟡', color: '#ff9800', progress: 70 },
            '1-2': { title: 'Hard', value: '70+', description: 'Problems solved', icon: '🔴', color: '#f44336', progress: 45 },
            '1-3': { title: 'Arrays', value: '95%', description: 'Mastery level', icon: '📊', color: '#2196f3', progress: 95 },
            '1-4': { title: 'Trees/Graphs', value: '88%', description: 'Mastery level', icon: '🌳', color: '#4caf50', progress: 88 },
            '1-5': { title: 'Dynamic Programming', value: '82%', description: 'Mastery level', icon: '🧩', color: '#9c27b0', progress: 82 },
            
            '2-0': { title: 'Strings', value: '90%', description: 'Mastery level', icon: '📝', color: '#ff5722', progress: 90 },
            '2-1': { title: 'Linked Lists', value: '92%', description: 'Mastery level', icon: '🔗', color: '#607d8b', progress: 92 },
            '2-2': { title: 'Stack/Queue', value: '85%', description: 'Mastery level', icon: '📚', color: '#795548', progress: 85 },
            '2-3': { title: 'Sorting', value: '96%', description: 'Mastery level', icon: '🔄', color: '#009688', progress: 96 },
            '2-4': { title: 'Binary Search', value: '87%', description: 'Mastery level', icon: '🎯', color: '#3f51b5', progress: 87 },
            '2-5': { title: 'Greedy', value: '78%', description: 'Mastery level', icon: '💰', color: '#8bc34a', progress: 78 },
            
            '3-0': { title: 'Contests', value: '50+', description: 'Participated', icon: '🎪', color: '#e91e63' },
            '3-1': { title: 'Hackathons', value: '12+', description: 'Won prizes', icon: '🏅', color: '#ff6f00' },
            '3-2': { title: 'Open Source', value: '25+', description: 'Contributions', icon: '🔓', color: '#00bcd4' },
            '3-3': { title: 'Code Reviews', value: '100+', description: 'Completed', icon: '👁️', color: '#673ab7' },
            '3-4': { title: 'Mentoring', value: '30+', description: 'Students helped', icon: '🎓', color: '#ff9800' },
            '3-5': { title: 'Study Time', value: '500+', description: 'Hours invested', icon: '⏰', color: '#4caf50' }
        };
        
        if (dsaContent[hexId]) {
            const item = dsaContent[hexId];
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'dsa-icon';
            iconDiv.textContent = item.icon;
            iconDiv.style.background = `linear-gradient(135deg, ${item.color} 0%, ${this.adjustColor(item.color, -20)} 100%)`;
            
            const titleSpan = document.createElement('div');
            titleSpan.className = 'dsa-title';
            titleSpan.textContent = item.title;
            
            const valueSpan = document.createElement('div');
            valueSpan.className = 'dsa-value';
            valueSpan.textContent = item.value;
            
            const descSpan = document.createElement('div');
            descSpan.className = 'dsa-description';
            descSpan.textContent = item.description;
            
            hexContent.appendChild(iconDiv);
            hexContent.appendChild(titleSpan);
            hexContent.appendChild(valueSpan);
            
            // Add progress bar for mastery items
            if (item.progress) {
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                
                const progressFill = document.createElement('div');
                progressFill.className = 'progress-fill';
                progressFill.style.width = '0%';
                
                progressBar.appendChild(progressFill);
                hexContent.appendChild(progressBar);
                
                // Animate progress bar
                setTimeout(() => {
                    progressFill.style.width = item.progress + '%';
                }, 500 + (row * 6 + col) * 50);
            }
            
            hexContent.appendChild(descSpan);
            hex.classList.add('dsa-hex');
        }
        
        hex.appendChild(hexContent);
        
        // Add fast entrance animation
        hex.style.opacity = '0';
        hex.style.animation = `fadeInUp 0.15s ease-out forwards`;
        hex.style.animationDelay = `${(row * 6 + col) * 8}ms`;
        
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

    adjustColor(color, amount) {
        const usePound = color[0] === '#';
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = (num >> 8 & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
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
        hex.style.animation = 'fadeInUp 0.15s ease-out forwards';
        hex.style.animationDelay = `${index * 8}ms`;
    });
});
