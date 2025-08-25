class SkillsHoneycomb {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.backBtn = document.getElementById('back-btn');
        
        // Carousel properties
        this.carouselOffset = 0;
        this.carouselSpeed = 0.2; // slower than projects page
        this.totalSkills = 18; // Total number of skills in center row
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
        this.startCarousel();
    }
    
    computeSizing() {
        // Calculate hexagon size for 18-column carousel (smaller than projects)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Smaller hexagon size than projects page
        const baseHexWidth = Math.floor(viewportWidth / 6.5); // Smaller than projects (4.27)
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth;
        const spacingY = baseHexHeight * 0.75;

        const rows = 3, cols = 18; // 3 rows x 18 columns = 54 hexagons
        const gridHeight = (rows - 1) * spacingY + baseHexHeight;

        let scale = 1;

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        const gapPx = Math.floor(15 * scale); // Smaller gap
        this.hexSpacingX = this.hexWidth + gapPx;
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx;
    }

    init() {
        this.generateSkillsHoneycomb();
        this.setupEventListeners();
        
        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateSkillsHoneycomb();
            }, 150);
        });
    }
    
    startCarousel() {
        const animate = () => {
            this.carouselOffset += this.carouselSpeed;
            
            // Update hexagon positions
            const hexagons = this.container.querySelectorAll('.hex');
            hexagons.forEach((hex, index) => {
                const row = Math.floor(index / this.totalSkills);
                const col = index % this.totalSkills;
                
                if (row === 1) { // Center row with skills
                    const baseX = col * this.hexSpacingX - this.carouselOffset;
                    const wrappedX = ((baseX % (this.totalSkills * this.hexSpacingX)) + (this.totalSkills * this.hexSpacingX)) % (this.totalSkills * this.hexSpacingX);
                    hex.style.left = wrappedX + 'px';
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    generateSkillsHoneycomb() {
        this.container.innerHTML = '';
        
        const rows = 3;
        const cols = this.totalSkills;
        
        // Calculate starting position to center vertically
        const totalGridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startY = (window.innerHeight - totalGridHeight) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const hex = this.createSkillHex(row, col, 0, startY);
                this.container.appendChild(hex);
            }
        }
    }

    createSkillHex(row, col, startX, startY) {
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
        
        // Define content based on row
        if (row === 1) { // Center row - Skills
            const skills = [
                { title: 'Python', level: 5, description: 'Data Science & Backend', icon: '🐍', color: '#3776ab' },
                { title: 'JavaScript', level: 5, description: 'Full-stack Development', icon: '⚡', color: '#f7df1e' },
                { title: 'React', level: 5, description: 'Frontend Framework', icon: '⚛️', color: '#61dafb' },
                { title: 'Node.js', level: 4, description: 'Backend Runtime', icon: '🟢', color: '#339933' },
                { title: 'MongoDB', level: 4, description: 'NoSQL Database', icon: '🍃', color: '#47a248' },
                { title: 'Docker', level: 4, description: 'Containerization', icon: '🐳', color: '#2496ed' },
                { title: 'AWS', level: 3, description: 'Cloud Services', icon: '☁️', color: '#ff9900' },
                { title: 'Git', level: 5, description: 'Version Control', icon: '📝', color: '#f05032' },
                { title: 'TypeScript', level: 4, description: 'Type-safe JavaScript', icon: '🔷', color: '#3178c6' },
                { title: 'Java', level: 4, description: 'Enterprise Applications', icon: '☕', color: '#ed8b00' },
                { title: 'Linux', level: 4, description: 'System Administration', icon: '🐧', color: '#fcc624' },
                { title: 'SQL', level: 4, description: 'Database Queries', icon: '🗃️', color: '#336791' },
                { title: 'Vue.js', level: 3, description: 'Progressive Framework', icon: '💚', color: '#4fc08d' },
                { title: 'Express', level: 4, description: 'Web Framework', icon: '🚀', color: '#68a063' },
                { title: 'Redis', level: 3, description: 'In-memory Database', icon: '🔴', color: '#dc382d' },
                { title: 'GraphQL', level: 3, description: 'Query Language', icon: '🔗', color: '#e10098' },
                { title: 'Kubernetes', level: 2, description: 'Container Orchestration', icon: '⚙️', color: '#326ce5' },
                { title: 'Firebase', level: 4, description: 'Backend as a Service', icon: '🔥', color: '#ffca28' }
            ];
            
            const skill = skills[col % skills.length];
        
            const skillIcon = document.createElement('div');
            skillIcon.className = 'skill-icon';
            skillIcon.textContent = skill.icon;
            skillIcon.style.background = `linear-gradient(135deg, ${skill.color} 0%, ${this.adjustColor(skill.color, -20)} 100%)`;
            
            const skillTitle = document.createElement('div');
            skillTitle.className = 'skill-title';
            skillTitle.textContent = skill.title;
            
            const skillLevel = document.createElement('div');
            skillLevel.className = 'skill-level';
            skillLevel.textContent = `Level ${skill.level}/5`;
            
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'skill-dots';
            
            for (let i = 1; i <= 5; i++) {
                const dot = document.createElement('div');
                dot.className = 'skill-dot';
                if (i <= skill.level) {
                    dot.classList.add('filled');
                }
                dotsContainer.appendChild(dot);
            }
            
            const skillDescription = document.createElement('div');
            skillDescription.className = 'skill-description';
            skillDescription.textContent = skill.description;
            
            hexContent.appendChild(skillIcon);
            hexContent.appendChild(skillTitle);
            hexContent.appendChild(skillLevel);
            hexContent.appendChild(dotsContainer);
            hexContent.appendChild(skillDescription);
            hex.classList.add('skill-hex');
            
        } else { // Top and bottom rows - Timeline/Certifications
            const certifications = [
                { title: '2020', event: 'Started Coding', description: 'First Python program', icon: '🚀', color: '#4caf50' },
                { title: '2021', event: 'Web Development', description: 'HTML, CSS, JavaScript', icon: '🌐', color: '#2196f3' },
                { title: '2022', event: 'Full-stack Projects', description: 'MERN Stack mastery', icon: '💻', color: '#ff9800' },
                { title: '2023', event: 'Cloud & DevOps', description: 'AWS, Docker, CI/CD', icon: '☁️', color: '#9c27b0' },
                { title: '2024', event: 'AI/ML Focus', description: 'Machine Learning', icon: '🤖', color: '#e91e63' },
                { title: '2025', event: 'Senior Developer', description: 'Leadership & Mentoring', icon: '👑', color: '#ffd700' },
                { title: 'AWS Certified', event: 'Cloud Solutions', description: 'Professional level cert', icon: '☁️', color: '#ff9500' },
                { title: 'Google Cloud', event: 'Professional Dev', description: 'Advanced cloud dev', icon: '🌐', color: '#4285f4' },
                { title: 'Docker Certified', event: 'Container Expert', description: 'Containerization pro', icon: '🐳', color: '#2496ed' },
                { title: 'React Certified', event: 'Frontend Expert', description: 'Modern UI development', icon: '⚛️', color: '#61dafb' },
                { title: 'Node.js Expert', event: 'Backend Master', description: 'Server-side JavaScript', icon: '🟢', color: '#339933' },
                { title: 'Scrum Master', event: 'Agile Expert', description: 'Project management', icon: '🎯', color: '#ff6b35' },
                { title: 'Leadership', event: 'Team Management', description: 'Leading development teams', icon: '👥', color: '#4ecdc4' },
                { title: 'Communication', event: 'Technical Writing', description: 'Documentation expert', icon: '💬', color: '#45b7d1' },
                { title: 'Problem Solving', event: 'Analytical Mind', description: 'Complex problem solver', icon: '🧩', color: '#f093fb' },
                { title: 'UI/UX Design', event: 'User Experience', description: 'Design thinking', icon: '🎨', color: '#96ceb4' },
                { title: 'Mentoring', event: 'Knowledge Share', description: 'Teaching and guiding', icon: '🎓', color: '#feca57' },
                { title: 'Open Source', event: 'Community Work', description: 'Contributing to projects', icon: '🔓', color: '#00bcd4' }
            ];
            
            const cert = certifications[col % certifications.length];
            
            const certIcon = document.createElement('div');
            certIcon.className = 'skill-icon';
            certIcon.textContent = cert.icon;
            certIcon.style.background = `linear-gradient(135deg, ${cert.color} 0%, ${this.adjustColor(cert.color, -20)} 100%)`;
            
            const certTitle = document.createElement('div');
            certTitle.className = 'timeline-year';
            certTitle.textContent = cert.title;
            
            const certEvent = document.createElement('div');
            certEvent.className = 'timeline-event';
            certEvent.textContent = cert.event;
            
            const certDescription = document.createElement('div');
            certDescription.className = 'skill-description';
            certDescription.textContent = cert.description;
            
            hexContent.appendChild(certIcon);
            hexContent.appendChild(certTitle);
            hexContent.appendChild(certEvent);
            hexContent.appendChild(certDescription);
            hex.classList.add('cert-hex');
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
        // Hover effects
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
    new SkillsHoneycomb();
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
