class SkillsHoneycomb {
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
        this.generateSkillsHoneycomb();
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateSkillsHoneycomb();
            }, 150);
        });
    }

    generateSkillsHoneycomb() {
        this.computeSizing();
        
        const container = document.getElementById('hexagon-grid');
        container.innerHTML = '';

        const skills = [
            // Programming Languages
            { icon: '🐍', title: 'Python', subtitle: 'Advanced', level: 5, color: '#3776ab' },
            { icon: '☕', title: 'Java', subtitle: 'Advanced', level: 5, color: '#f89820' },
            { icon: '🌐', title: 'JavaScript', subtitle: 'Advanced', level: 4, color: '#f7df1e' },
            { icon: '⚛️', title: 'React', subtitle: 'Intermediate', level: 4, color: '#61dafb' },
            { icon: '🎯', title: 'TypeScript', subtitle: 'Intermediate', level: 3, color: '#3178c6' },
            { icon: '🔧', title: 'C++', subtitle: 'Intermediate', level: 3, color: '#00599c' },
            
            // Frameworks & Tools
            { icon: '🚀', title: 'Node.js', subtitle: 'Advanced', level: 4, color: '#339933' },
            { icon: '🐳', title: 'Docker', subtitle: 'Intermediate', level: 3, color: '#2496ed' },
            { icon: '☁️', title: 'AWS', subtitle: 'Intermediate', level: 3, color: '#ff9900' },
            { icon: '🗄️', title: 'MongoDB', subtitle: 'Advanced', level: 4, color: '#47a248' },
            { icon: '🐘', title: 'PostgreSQL', subtitle: 'Intermediate', level: 3, color: '#336791' },
            { icon: '🔥', title: 'Firebase', subtitle: 'Advanced', level: 4, color: '#ffca28' },
            
            // Journey Timeline
            { icon: '🎓', title: '2020', subtitle: 'Started CS Journey', type: 'journey', color: '#8e44ad' },
            { icon: '💼', title: '2021', subtitle: 'First Internship', type: 'journey', color: '#2980b9' },
            { icon: '🏆', title: '2022', subtitle: 'Hackathon Winner', type: 'journey', color: '#e74c3c' },
            { icon: '🚀', title: '2023', subtitle: 'Full Stack Dev', type: 'journey', color: '#27ae60' },
            { icon: '🌟', title: '2024', subtitle: 'Senior Developer', type: 'journey', color: '#f39c12' },
            { icon: '🎯', title: '2025', subtitle: 'Tech Lead Goals', type: 'journey', color: '#9b59b6' },
            
            // Soft Skills
            { icon: '👥', title: 'Leadership', subtitle: 'Team Management', level: 4, color: '#e67e22' },
            { icon: '🎨', title: 'UI/UX Design', subtitle: 'Creative', level: 3, color: '#e91e63' },
            { icon: '📊', title: 'Data Analysis', subtitle: 'Analytics', level: 4, color: '#00bcd4' },
            { icon: '🔍', title: 'Problem Solving', subtitle: 'Critical Thinking', level: 5, color: '#795548' },
            { icon: '🗣️', title: 'Communication', subtitle: 'Presentation', level: 4, color: '#607d8b' },
            { icon: '⚡', title: 'Agile/Scrum', subtitle: 'Methodology', level: 4, color: '#ff5722' }
        ];

        const rows = 4;
        const cols = 6;
        
        // Center the grid
        const totalWidth = (cols - 1) * this.hexSpacingX;
        const totalHeight = (rows - 1) * this.hexSpacingY;
        const startX = (window.innerWidth - totalWidth) / 2;
        const startY = (window.innerHeight - totalHeight) / 2;

        let skillIndex = 0;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (skillIndex >= skills.length) break;
                
                const skill = skills[skillIndex];
                const hexagon = this.createHexagon(skill, skillIndex);
                
                // Calculate position with offset for odd rows
                const offsetX = (row % 2) * (this.hexSpacingX / 2);
                const x = startX + col * this.hexSpacingX + offsetX;
                const y = startY + row * this.hexSpacingY;
                
                hexagon.style.left = `${x}px`;
                hexagon.style.top = `${y}px`;
                hexagon.style.width = `${this.hexWidth}px`;
                hexagon.style.height = `${this.hexHeight}px`;
                hexagon.style.animationDelay = `${skillIndex * 0.1}s`;
                
                container.appendChild(hexagon);
                skillIndex++;
            }
        }
    }

    createHexagon(skill, index) {
        const hexagon = document.createElement('div');
        hexagon.className = 'hexagon';
        
        const svg = this.createHexagonSVG(skill.color);
        const content = document.createElement('div');
        content.className = 'hex-content';
        
        if (skill.type === 'journey') {
            content.innerHTML = `
                <span class="hex-icon">${skill.icon}</span>
                <div class="journey-year">${skill.title}</div>
                <div class="journey-role">${skill.subtitle}</div>
            `;
        } else {
            const skillDots = skill.level ? this.createSkillLevel(skill.level) : '';
            content.innerHTML = `
                <span class="hex-icon">${skill.icon}</span>
                <div class="hex-title">${skill.title}</div>
                <div class="hex-subtitle">${skill.subtitle}</div>
                ${skillDots}
            `;
        }
        
        hexagon.appendChild(svg);
        hexagon.appendChild(content);
        
        return hexagon;
    }

    createSkillLevel(level) {
        const dots = [];
        for (let i = 1; i <= 5; i++) {
            dots.push(`<div class="skill-dot ${i <= level ? 'filled' : ''}"></div>`);
        }
        return `<div class="skill-level">${dots.join('')}</div>`;
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
    new SkillsHoneycomb();
});
