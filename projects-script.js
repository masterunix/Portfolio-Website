class ProjectsHoneycomb {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.backBtn = document.getElementById('back-btn');
        
        // Carousel properties
        this.carouselOffset = 0;
        this.carouselSpeed = 0.3; // pixels per frame
        this.totalProjects = 14; // Total number of projects in center row
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
        this.startCarousel();
    }
    
    computeSizing() {
        // Calculate hexagon size for 14-column carousel
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Optimal hexagon size with overflow allowed
        const baseHexWidth = Math.floor(viewportWidth / 4.27); // Reduced by 25% from /3.2
        const baseHexHeight = Math.floor(baseHexWidth * 1.1547);
        const spacingX = baseHexWidth;
        const spacingY = baseHexHeight * 0.75;

        const rows = 3, cols = 14; // 3 rows x 14 columns = 42 hexagons
        const gridHeight = (rows - 1) * spacingY + baseHexHeight;

        // Allow hexagons to be larger, top/bottom rows can be cut off
        let scale = 1;
        // Remove height scaling to allow overflow

        this.hexWidth = Math.floor(baseHexWidth * scale);
        this.hexHeight = Math.floor(baseHexHeight * scale);
        const gapPx = Math.floor(20 * scale); // Proportional gap
        this.hexSpacingX = this.hexWidth + gapPx;
        this.hexSpacingY = this.hexHeight * 0.75 + gapPx;
    }

    init() {
        this.generateProjectHoneycomb();
        this.setupEventListeners();
        
        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateProjectHoneycomb();
            }, 150);
        });
    }
    
    generateProjectHoneycomb() {
        const fragment = document.createDocumentFragment();
        
        const rows = 3;
        const cols = 14;
        
        const gridHeight = (rows - 1) * this.hexSpacingY + this.hexHeight;
        const startY = (window.innerHeight - gridHeight) / 2;
        
        // Create multiple sets of hexagons for seamless carousel
        for (let set = 0; set < 3; set++) { // 3 sets for smooth looping
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const hex = this.createHexagon(row, col, set);
                    hex.style.top = startY + row * this.hexSpacingY + 'px';
                    fragment.appendChild(hex);
                }
            }
        }
        
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
    
    createHexagon(row, col, set) {
        const hex = document.createElement('div');
        hex.className = 'hex carousel-hex';
        
        const offsetX = (row % 2 === 1) ? this.hexSpacingX / 2 : 0;
        const baseX = col * this.hexSpacingX + offsetX;
        const setOffset = set * (14 * this.hexSpacingX); // Each set spans 14 columns
        const x = baseX + setOffset;
        
        hex.style.left = x + 'px';
        hex.style.width = this.hexWidth + 'px';
        hex.style.height = this.hexHeight + 'px';
        hex.setAttribute('data-set', set);

        const svg = this.createSVGHex(this.hexWidth, this.hexHeight);
        hex.appendChild(svg);
        
        const hexContent = document.createElement('div');
        hexContent.className = 'hex-content';
        
        const hexId = `${row}-${col}`;
        hex.setAttribute('data-hex-id', hexId);
        
        // Define content based on row
        if (row === 1) { // Center row - Projects
            const projects = [
                { title: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', description: 'Full-stack marketplace with payment integration', icon: '🛒', color: '#667eea' },
                { title: 'Task Manager App', tech: 'Vue.js, Firebase', description: 'Collaborative project management tool', icon: '✅', color: '#764ba2' },
                { title: 'Weather Dashboard', tech: 'JavaScript, API', description: 'Real-time weather data visualization', icon: '🌤️', color: '#f093fb' },
                { title: 'Chat Application', tech: 'Socket.io, Express', description: 'Real-time messaging platform', icon: '💬', color: '#4facfe' },
                { title: 'Portfolio Website', tech: 'HTML, CSS, JS', description: 'Interactive hexagonal portfolio design', icon: '🎨', color: '#43e97b' },
                { title: 'Data Visualizer', tech: 'D3.js, Python', description: 'Interactive charts and analytics', icon: '📊', color: '#fa709a' },
                { title: 'Mobile Game', tech: 'React Native', description: 'Cross-platform puzzle game', icon: '🎮', color: '#fee140' },
                { title: 'Blog Platform', tech: 'Next.js, Prisma', description: 'Modern CMS with markdown support', icon: '📝', color: '#a8edea' },
                { title: 'AI Chatbot', tech: 'Python, TensorFlow', description: 'Natural language processing bot', icon: '🤖', color: '#d299c2' },
                { title: 'Music Player', tech: 'React, Web Audio API', description: 'Streaming music application', icon: '🎵', color: '#89f7fe' },
                { title: 'Fitness Tracker', tech: 'Flutter, SQLite', description: 'Health and workout monitoring', icon: '💪', color: '#667eea' },
                { title: 'Recipe Finder', tech: 'Angular, REST API', description: 'Ingredient-based recipe search', icon: '🍳', color: '#764ba2' },
                { title: 'Social Network', tech: 'Django, PostgreSQL', description: 'Community platform with real-time feeds', icon: '👥', color: '#ff6b6b' },
                { title: 'Crypto Tracker', tech: 'React, Chart.js', description: 'Cryptocurrency portfolio manager', icon: '₿', color: '#4ecdc4' }
            ];
            
            const project = projects[col % projects.length];
            
            const projectIcon = document.createElement('div');
            projectIcon.className = 'project-icon';
            projectIcon.textContent = project.icon;
            projectIcon.style.background = `linear-gradient(135deg, ${project.color} 0%, ${this.adjustColor(project.color, -20)} 100%)`;
            
            const projectTitle = document.createElement('div');
            projectTitle.className = 'project-title';
            projectTitle.textContent = project.title;
            
            const projectTech = document.createElement('div');
            projectTech.className = 'project-tech';
            projectTech.textContent = project.tech;
            
            const projectDescription = document.createElement('div');
            projectDescription.className = 'project-description';
            projectDescription.textContent = project.description;
            
            hexContent.appendChild(projectIcon);
            hexContent.appendChild(projectTitle);
            hexContent.appendChild(projectTech);
            hexContent.appendChild(projectDescription);
            hex.classList.add('project-hex');
            
        } else { // Top and bottom rows - Certifications
            const certifications = [
                { title: 'AWS Certified', tech: 'Cloud Solutions Architect', description: 'Professional level certification', icon: '☁️', color: '#ff9500' },
                { title: 'Google Cloud', tech: 'Professional Developer', description: 'Advanced cloud development', icon: '🌐', color: '#4285f4' },
                { title: 'Microsoft Azure', tech: 'DevOps Engineer', description: 'CI/CD and automation expert', icon: '⚡', color: '#0078d4' },
                { title: 'Docker Certified', tech: 'Container Specialist', description: 'Containerization expertise', icon: '🐳', color: '#2496ed' },
                { title: 'Kubernetes', tech: 'Application Developer', description: 'Orchestration and scaling', icon: '⚙️', color: '#326ce5' },
                { title: 'MongoDB', tech: 'Database Administrator', description: 'NoSQL database management', icon: '🍃', color: '#47a248' },
                { title: 'React Certified', tech: 'Frontend Specialist', description: 'Modern UI development', icon: '⚛️', color: '#61dafb' },
                { title: 'Node.js Expert', tech: 'Backend Developer', description: 'Server-side JavaScript', icon: '🟢', color: '#339933' },
                { title: 'Python Institute', tech: 'PCAP Certified', description: 'Programming fundamentals', icon: '🐍', color: '#3776ab' },
                { title: 'Scrum Master', tech: 'Agile Methodology', description: 'Project management', icon: '🎯', color: '#ff6b35' },
                { title: 'Cybersecurity', tech: 'CompTIA Security+', description: 'Information security', icon: '🔒', color: '#e74c3c' },
                { title: 'Machine Learning', tech: 'TensorFlow Certified', description: 'AI and deep learning', icon: '🧠', color: '#ff6f00' },
                { title: 'DevOps Foundation', tech: 'ITIL Certified', description: 'IT service management', icon: '🔄', color: '#2ecc71' },
                { title: 'Blockchain', tech: 'Ethereum Developer', description: 'Smart contract development', icon: '⛓️', color: '#627eea' }
            ];
            
            const cert = certifications[col % certifications.length];
            
            const certIcon = document.createElement('div');
            certIcon.className = 'cert-icon';
            certIcon.textContent = cert.icon;
            certIcon.style.background = `linear-gradient(135deg, ${cert.color} 0%, ${this.adjustColor(cert.color, -20)} 100%)`;
            
            const certTitle = document.createElement('div');
            certTitle.className = 'cert-title';
            certTitle.textContent = cert.title;
            
            const certTech = document.createElement('div');
            certTech.className = 'cert-tech';
            certTech.textContent = cert.tech;
            
            const certDescription = document.createElement('div');
            certDescription.className = 'cert-description';
            certDescription.textContent = cert.description;
            
            hexContent.appendChild(certIcon);
            hexContent.appendChild(certTitle);
            hexContent.appendChild(certTech);
            hexContent.appendChild(certDescription);
            hex.classList.add('cert-hex');
        }
        
        hex.appendChild(hexContent);
        return hex;
    }

    createSVGHex(width, height) {
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
        // No hexagons to skip in carousel - all positions are used
        return false;
    }

    startCarousel() {
        const animate = () => {
            // Update all hexagon positions
            const hexagons = document.querySelectorAll('.carousel-hex');
            hexagons.forEach(hex => {
                let currentLeft = parseFloat(hex.style.left);
                currentLeft -= this.carouselSpeed;
                
                // Reset position when hexagon moves completely off screen to the left
                const setWidth = 14 * this.hexSpacingX;
                if (currentLeft <= -setWidth) {
                    currentLeft += 3 * setWidth; // Move to the end of the carousel
                }
                
                hex.style.left = currentLeft + 'px';
            });
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
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

        // Project click handlers (placeholder for future functionality)
        this.container.addEventListener('click', (e) => {
            const hex = e.target.closest('.hex');
            if (hex && hex.classList.contains('project-hex')) {
                const hexId = hex.getAttribute('data-hex-id');
                console.log(`Clicked project: ${hexId}`);
                // Future: Add project detail modal or navigation
            }
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

// Initialize the projects page when DOM is loaded

// Fast entrance animation
window.addEventListener('load', () => {
    const hexagons = document.querySelectorAll('.hex');
    
    hexagons.forEach((hex, index) => {
        hex.style.opacity = '0';
        hex.style.animation = 'fadeInUp 0.15s ease-out forwards';
        hex.style.animationDelay = `${index * 8}ms`; // 8ms stagger for fast animation
    });
});


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ProjectsHoneycomb');
    try {
        new ProjectsHoneycomb();
        console.log('ProjectsHoneycomb initialized successfully');
    } catch (error) {
        console.error('Error initializing ProjectsHoneycomb:', error);
    }
});
