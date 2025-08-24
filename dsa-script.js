class DSAHoneycomb {
    constructor() {
        this.hexWidth = 0;
        this.hexHeight = 0;
        this.hexSpacingX = 0;
        this.hexSpacingY = 0;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    computeSizing() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Optimal hexagon size
        const baseHexWidth = Math.floor(viewportWidth / 5.69);
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth;
        const spacingY = baseHexHeight * 0.75;

        const rows = 4, cols = 6;
        const gridWidth = (cols - 1) * spacingX + baseHexWidth;
        const gridHeight = (rows - 1) * spacingY + baseHexHeight;

        // Allow larger hexagons, some may extend beyond viewport
        let scale = 1;

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        const gapPx = 19;
        this.hexSpacingX = this.hexWidth + gapPx;
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx;
    }

    init() {
        this.generateDSAHoneycomb();
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateDSAHoneycomb();
            }, 150);
        });
    }

    generateDSAHoneycomb() {
        this.computeSizing();
        
        const container = document.getElementById('hexagon-grid');
        container.innerHTML = '';

        const dsaStats = [
            // Platform Stats
            { icon: '💻', title: 'LeetCode', subtitle: '450+ Problems', stat: '450+', color: '#ffa116' },
            { icon: '🏆', title: 'Contest Rating', subtitle: 'Max: 1847', stat: '1847', color: '#ff6b6b', class: 'contest-rating' },
            { icon: '🎯', title: 'CodeChef', subtitle: '3★ (1650+)', stat: '3★', color: '#5b4638' },
            { icon: '⚡', title: 'Codeforces', subtitle: 'Pupil (1200+)', stat: '1200+', color: '#1f8dd6' },
            { icon: '🔥', title: 'Daily Streak', subtitle: 'Current: 45 days', stat: '45', color: '#ff4757' },
            { icon: '📊', title: 'HackerRank', subtitle: '5★ Problem Solving', stat: '5★', color: '#00ea64' },

            // Problem Categories
            { icon: '🌳', title: 'Trees & Graphs', subtitle: '120+ Problems', progress: 85, color: '#27ae60' },
            { icon: '🔄', title: 'Dynamic Programming', subtitle: '80+ Problems', progress: 70, color: '#8e44ad' },
            { icon: '📚', title: 'Arrays & Strings', subtitle: '150+ Problems', progress: 95, color: '#3498db' },
            { icon: '🔍', title: 'Binary Search', subtitle: '45+ Problems', progress: 80, color: '#e74c3c' },
            { icon: '⚖️', title: 'Greedy & Backtrack', subtitle: '60+ Problems', progress: 75, color: '#f39c12' },
            { icon: '🧮', title: 'Math & Bit Manipulation', subtitle: '35+ Problems', progress: 65, color: '#9b59b6' },

            // Difficulty Breakdown
            { icon: '🟢', title: 'Easy', subtitle: '200+ Solved', difficulty: 'easy', color: '#4caf50' },
            { icon: '🟡', title: 'Medium', subtitle: '180+ Solved', difficulty: 'medium', color: '#ff9800' },
            { icon: '🔴', title: 'Hard', subtitle: '70+ Solved', difficulty: 'hard', color: '#f44336' },

            // Achievements
            { icon: '🏅', title: 'Weekly Contest', subtitle: 'Top 5% (3x)', color: '#ffd700' },
            { icon: '🎖️', title: 'Biweekly Contest', subtitle: 'Top 10% (5x)', color: '#c0392b' },
            { icon: '🚀', title: 'Speed Coding', subtitle: 'Sub 30min Medium', color: '#2ecc71' },
            { icon: '🧠', title: 'Problem Setter', subtitle: '5+ Problems Created', color: '#e67e22' },
            { icon: '👨‍🏫', title: 'Mentor', subtitle: '50+ Students Helped', color: '#34495e' },
            { icon: '📈', title: 'Growth Rate', subtitle: '+200 this year', color: '#16a085' },

            // Study Topics
            { icon: '🔗', title: 'Linked Lists', subtitle: 'Mastered', progress: 90, color: '#7f8c8d' },
            { icon: '📦', title: 'Stacks & Queues', subtitle: 'Advanced', progress: 85, color: '#95a5a6' },
            { icon: '🌐', title: 'System Design', subtitle: 'Learning', progress: 40, color: '#2c3e50' }
        ];

        const rows = 4;
        const cols = 6;
        
        // Center the grid
        const totalWidth = (cols - 1) * this.hexSpacingX;
        const totalHeight = (rows - 1) * this.hexSpacingY;
        const startX = (window.innerWidth - totalWidth) / 2;
        const startY = (window.innerHeight - totalHeight) / 2;

        let statIndex = 0;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (statIndex >= dsaStats.length) break;
                
                const stat = dsaStats[statIndex];
                const hexagon = this.createHexagon(stat, statIndex);
                
                // Calculate position with offset for odd rows
                const offsetX = (row % 2) * (this.hexSpacingX / 2);
                const x = startX + col * this.hexSpacingX + offsetX;
                const y = startY + row * this.hexSpacingY;
                
                hexagon.style.left = `${x}px`;
                hexagon.style.top = `${y}px`;
                hexagon.style.width = `${this.hexWidth}px`;
                hexagon.style.height = `${this.hexHeight}px`;
                hexagon.style.animationDelay = `${statIndex * 0.1}s`;
                
                container.appendChild(hexagon);
                statIndex++;
            }
        }
    }

    createHexagon(stat, index) {
        const hexagon = document.createElement('div');
        hexagon.className = 'hexagon';
        
        const svg = this.createHexagonSVG(stat.color);
        const content = document.createElement('div');
        content.className = 'hex-content';
        
        let contentHTML = `<span class="hex-icon">${stat.icon}</span>`;
        
        if (stat.stat) {
            contentHTML += `
                <div class="stat-number ${stat.class || ''}">${stat.stat}</div>
                <div class="hex-title">${stat.title}</div>
                <div class="hex-subtitle">${stat.subtitle}</div>
            `;
        } else if (stat.progress !== undefined) {
            contentHTML += `
                <div class="hex-title">${stat.title}</div>
                <div class="hex-subtitle">${stat.subtitle}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${stat.progress}%"></div>
                </div>
            `;
        } else if (stat.difficulty) {
            contentHTML += `
                <div class="hex-title difficulty-${stat.difficulty}">${stat.title}</div>
                <div class="hex-subtitle">${stat.subtitle}</div>
            `;
        } else {
            contentHTML += `
                <div class="hex-title">${stat.title}</div>
                <div class="hex-subtitle">${stat.subtitle}</div>
            `;
        }
        
        content.innerHTML = contentHTML;
        
        hexagon.appendChild(svg);
        hexagon.appendChild(content);
        
        return hexagon;
    }

    createHexagonSVG(color) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 115.47');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M25 0 L75 0 L100 43.3 L75 86.6 L25 86.6 L0 43.3 Z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        path.setAttribute('stroke-width', '1');
        
        svg.appendChild(path);
        return svg;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DSAHoneycomb();
});
