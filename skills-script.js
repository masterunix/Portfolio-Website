class SkillsWebsite {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        if (!this.container) {
            console.error('Honeycomb container not found!');
            return;
        }
        
        this.typeHeaderText();
        this.computeSizing();
        this.generateHexagons();
        this.setupEventListeners();
    }
    
    typeHeaderText() {
        const headerElement = document.querySelector('#main-header h1');
        const text = "Skills & Journey";
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
    
    computeSizing() {
        const viewportWidth = window.innerWidth;
        const baseHexWidth = Math.floor(viewportWidth / 5.69);
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        
        this.hexWidth = baseHexWidth;
        this.hexHeight = baseHexHeight;
        this.hexSpacingX = this.hexWidth + 19;
        this.hexSpacingY = this.hexHeight * 0.75 + 19;
    }
    
    generateHexagons() {
        this.container.innerHTML = '';
        
        const rows = 5;
        const cols = 8;
        
        const gridWidth = (cols - 1) * this.hexSpacingX + this.hexWidth;
        const gridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startX = (window.innerWidth - gridWidth) / 2;
        const startY = (window.innerHeight - gridHeight) / 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.shouldSkipHexagon(row, col)) continue;
                
                const hex = this.createHexagon(row, col, startX, startY);
                this.container.appendChild(hex);
            }
        }
    }
    
    shouldSkipHexagon(row, col) {
        const skipList = [
            [0, 0], [4, 0], [0, 7], [4, 7], // corners
            [1, 7], [3, 7] // right edge
        ];
        return skipList.some(([r, c]) => r === row && c === col);
    }
    
    createHexagon(row, col, startX, startY) {
        const hex = document.createElement('div');
        hex.className = 'hex skills-hex';
        
        const offsetX = (row % 2 === 1) ? this.hexSpacingX / 2 : 0;
        const x = startX + col * this.hexSpacingX + offsetX;
        const y = startY + row * this.hexSpacingY;
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.style.width = this.hexWidth + 'px';
        hex.style.height = this.hexHeight + 'px';
        
        // Add SVG background
        const svg = this.createSVGHex();
        hex.appendChild(svg);
        
        // Add content
        const content = this.createHexContent(row, col);
        hex.appendChild(content);
        
        // Add entrance animation
        hex.style.opacity = '0';
        hex.style.animation = `fadeInUp 0.15s ease-out forwards`;
        hex.style.animationDelay = `${(row * 8 + col) * 8}ms`;
        
        return hex;
    }
    
    createSVGHex() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 190 212');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M85.5 3.63965C91.3786 0.245625 98.6214 0.245625 104.5 3.63965L178.896 46.5928C184.775 49.9868 188.396 56.2589 188.396 63.0469V148.953C188.396 155.741 184.775 162.013 178.896 165.407L104.5 208.36C98.805 211.648 91.8296 211.751 86.0547 208.669L85.5 208.36L11.1035 165.407C5.22494 162.013 1.60356 155.741 1.60352 148.953V63.0469C1.60356 56.2589 5.22493 49.9868 11.1035 46.5928L85.5 3.63965Z');
        path.setAttribute('fill', '#1a1a1a');
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '2');
        
        svg.appendChild(path);
        return svg;
    }
    
    createHexContent(row, col) {
        const content = document.createElement('div');
        content.className = 'hex-content';
        
        const hexId = `${row}-${col}`;
        const skillData = this.getSkillData(hexId);
        
        if (skillData) {
            // Check if this is a row 2 hexagon (career/internship content)
            const isRow2 = hexId.startsWith('2-');
            
            // Icon
            const icon = document.createElement('div');
            icon.className = 'hex-icon';
            icon.innerHTML = skillData.icon || '⭐';
            icon.style.background = `linear-gradient(135deg, ${skillData.color || '#666'} 0%, ${this.adjustColor(skillData.color || '#666', -20)} 100%)`;
            content.appendChild(icon);
            
            // Skill name
            const name = document.createElement('span');
            name.className = 'hex-domain';
            name.innerHTML = `<strong>${skillData.skill}</strong>`;
            if (isRow2) {
                name.style.fontSize = '12px'; // Larger for row 2
            }
            content.appendChild(name);
            
            // Description
            const desc = document.createElement('span');
            desc.className = 'hex-description';
            desc.textContent = skillData.description;
            if (isRow2) {
                desc.style.fontSize = '9px'; // Larger for row 2
            }
            content.appendChild(desc);
            
            // Stars
            if (skillData.stars) {
                const stars = document.createElement('div');
                stars.className = 'hex-stars';
                stars.innerHTML = this.createStarRating(skillData.stars);
                content.appendChild(stars);
            }
            
            // Download buttons for certifications
            if (skillData.certifications) {
                skillData.certifications.forEach(cert => {
                    const btn = document.createElement('button');
                    btn.className = 'hex-download-btn';
                    btn.textContent = `${cert.name} ↓`;
                    btn.style.pointerEvents = 'auto';
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`./Assets/Certifcations etc/${cert.filename}`, '_blank');
                    };
                    content.appendChild(btn);
                });
            }
            
            // Dual star ratings for video editing
            if (skillData.dualRatings) {
                skillData.dualRatings.forEach(rating => {
                    const ratingDiv = document.createElement('div');
                    ratingDiv.style.display = 'flex';
                    ratingDiv.style.flexDirection = 'column';
                    ratingDiv.style.alignItems = 'center';
                    ratingDiv.style.marginBottom = '2px';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.style.fontSize = '7px';
                    nameSpan.style.color = '#ccc';
                    nameSpan.textContent = rating.name;
                    
                    const starsDiv = document.createElement('div');
                    starsDiv.className = 'hex-stars';
                    starsDiv.innerHTML = this.createStarRating(rating.stars);
                    
                    ratingDiv.appendChild(nameSpan);
                    ratingDiv.appendChild(starsDiv);
                    content.appendChild(ratingDiv);
                });
            }
        }
        
        return content;
    }
    
    getSkillData(hexId) {
        const skills = {
            '1-1': { skill: 'React.js', description: 'Frontend Framework', stars: 4, color: '#61dafb', icon: '⚛️' },
            '1-2': { skill: 'Node.js', description: 'Backend Runtime', stars: 4, color: '#339933', icon: '🟢' },
            '1-3': { skill: 'MongoDB', description: 'NoSQL Database', stars: 4, color: '#47a248', icon: '🍃' },
            '1-4': { skill: 'JavaScript', description: 'Programming Language', stars: 4, color: '#f7df1e', icon: '📜' },
            '1-5': { skill: 'Docker', description: 'Containerization', stars: 3, color: '#2496ed', icon: '🐳' },
            '1-6': { skill: 'Python', description: 'Programming Language', stars: 4, color: '#3776ab', icon: '🐍' },
            
            '2-2': { 
                skill: 'Digisphere Pvt. Ltd.', 
                description: 'Website Developer Intern (April 2023 – August 2024)', 
                stars: 0, 
                color: '#ff6b6b', 
                icon: '🏢',
                certifications: [{ name: 'Certificate', filename: 'Digisphere.pdf' }]
            },
            '2-3': { 
                skill: 'Xebia', 
                description: 'Full Stack Internship (June 2025 - July 2025)', 
                stars: 0, 
                color: '#4ecdc4', 
                icon: '💼',
                certifications: [{ name: 'Certificate', filename: 'Xebia.pdf' }]
            },
            '2-4': { 
                skill: 'Certifications', 
                description: 'Industry Recognition', 
                stars: 0, 
                color: '#45b7d1', 
                icon: '🏆',
                certifications: [
                    { name: 'Google', filename: 'Google.pdf' },
                    { name: 'Oracle', filename: 'Oracle.pdf' }
                ]
            },
            '2-5': { 
                skill: 'Video Editing', 
                description: 'Creative Skills', 
                stars: 0, 
                color: '#ff9ff3', 
                icon: '🎬',
                dualRatings: [
                    { name: 'Premiere Pro', stars: 4.5 },
                    { name: 'After Effects', stars: 3.5 }
                ]
            },
            
            '3-1': { skill: 'AWS', description: 'Cloud Services', stars: 3, color: '#ff9900', icon: '☁️' },
            '3-2': { skill: 'Git', description: 'Version Control', stars: 4, color: '#f05032', icon: '📊' },
            '3-3': { skill: 'Machine Learning', description: 'AI/ML Tools', stars: 3.5, color: '#ff6f00', icon: '🤖' },
            '3-4': { skill: 'REST APIs', description: 'Web Services', stars: 4, color: '#00d4aa', icon: '🔗' },
            '3-5': { skill: 'SQL', description: 'Database Query', stars: 4, color: '#336791', icon: '🗃️' },
            '3-6': { skill: 'Linux', description: 'Operating System', stars: 3.5, color: '#fcc624', icon: '🐧' }
        };
        
        return skills[hexId];
    }
    
    createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="star full">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<span class="star half">☆</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="star empty">☆</span>';
        }
        
        return starsHTML;
    }
    
    adjustColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.computeSizing();
            this.generateHexagons();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Skills Website...');
    new SkillsWebsite();
});
