class ProjectsHoneycomb {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.backBtn = document.getElementById('back-btn');
        this.navigator = document.getElementById('project-navigator');
        this.navDotsContainer = document.querySelector('.nav-dots-container');
        
        // Carousel properties
        this.carouselOffset = 0;
        this.carouselSpeed = 0.39; // pixels per frame (30% increase from 0.3)
        this.totalProjects = 14; // Total number of projects in center row
        this.targetOffset = 0; // For smooth navigation
        this.isNavigating = false;
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
        this.createNavigator();
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

    typeHeaderText() {
        const headerElement = document.querySelector('#main-header h1');
        const text = "My Projects & Work";
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
        this.generateProjectHoneycomb();
        this.setupEventListeners();
        
        // Debounced resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.computeSizing();
                this.generateProjectHoneycomb();
                this.createNavigator();
            }, 150);
        });
    }
    
    createNavigator() {
        this.navDotsContainer.innerHTML = '';
        
        // Get project data (updated for navigation)
        const projects = [
            { title: 'Job Nest', tech: 'MERN Stack', description: 'A comprehensive platform for job seekers and employers with advanced matching algorithms', icon: '💼', color: '#667eea', github: 'https://github.com/masterunix/JobNest-v1', visit: 'Will be deployed soon' },
            { title: '450 House of Sourdough', tech: 'Modern Web Stack', description: 'Elegant website for artisanal sourdough bakery with e-commerce integration', icon: '🍞', color: '#d4a574', github: 'Available on request', visit: '450houseofsourdough.com' },
            { title: 'movie_fy', tech: 'Flutter, Dart', description: 'Feature-rich mobile app for movie enthusiasts with reviews and recommendations', icon: '🎬', color: '#e74c3c', github: 'https://github.com/masterunix/Fluttter-Movie-App', visit: null },
            { title: 'Mobile Dev Project', tech: 'React Native', description: 'Cross-platform mobile application with native performance and modern UI', icon: '📱', color: '#61dafb', github: 'Coming Soon', visit: null },
            { title: 'WalterWins', tech: 'Full Stack', description: 'In-progress online gaming platform with real-time multiplayer capabilities', icon: '🎮', color: '#9b59b6', github: 'In Development', visit: null },
            { title: 'Personal DIY Server', tech: 'Ubuntu, Nginx', description: 'Custom-built server infrastructure from repurposed hardware with enterprise features', icon: '🖥️', color: '#34495e', github: 'Private', visit: 'Request Access' },
            { title: 'Jarvis 2.0', tech: 'AI/ML, Python', description: 'Advanced AI assistant with natural language processing and smart automation', icon: '🤖', color: '#f39c12', github: 'Coming Soon', visit: null },
            { title: 'AI ML Project', tech: 'TensorFlow, PyTorch', description: 'Cutting-edge machine learning solution for data analysis and prediction', icon: '🧠', color: '#e67e22', github: 'In Development', visit: null },
            { title: 'AI ML Project 2', tech: 'Deep Learning', description: 'Advanced neural network implementation for computer vision applications', icon: '👁️', color: '#3498db', github: 'Coming Soon', visit: null },
            { title: 'Cyber Security Project', tech: 'Security Tools', description: 'Comprehensive cybersecurity solution with threat detection and prevention', icon: '🔒', color: '#e74c3c', github: 'Coming Soon', visit: null },
            { title: 'DSA Stats', tech: 'Data Structures', description: 'Explore coding achievements and algorithm mastery statistics', icon: '📊', color: '#2ecc71', github: null, visit: 'dsa.html' },
            { title: 'Skills & Journey', tech: 'Career Path', description: 'Discover technical skills, experience timeline, and professional growth', icon: '🎯', color: '#9b59b6', github: null, visit: 'skills.html' },
            { title: 'Upcoming Project', tech: 'TBD', description: 'Exciting new project in planning phase with innovative features', icon: '🚀', color: '#95a5a6', github: 'Coming Soon', visit: null },
            { title: 'Future Innovation', tech: 'Next-Gen Tech', description: 'Revolutionary project leveraging emerging technologies and modern frameworks', icon: '✨', color: '#f1c40f', github: 'Coming Soon', visit: null }
        ];
        
        projects.forEach((project, index) => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.setAttribute('data-project-index', index);
            
            const projectIcon = document.createElement('div');
            projectIcon.className = 'nav-project-icon';
            projectIcon.textContent = project.icon;
            projectIcon.style.background = `linear-gradient(135deg, ${project.color} 0%, ${this.adjustColor(project.color, -20)} 100%)`;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.textContent = project.title;
            
            navItem.appendChild(projectIcon);
            navItem.appendChild(tooltip);
            
            // Add click handler
            navItem.addEventListener('click', () => {
                this.navigateToProject(index);
            });
            
            this.navDotsContainer.appendChild(navItem);
        });
        
        // Set first dot as active initially
        this.updateActiveNavDot(0);
    }
    
    navigateToProject(projectIndex) {
        // Calculate target offset to center the project in viewport
        const viewportCenter = window.innerWidth / 2;
        const projectPosition = projectIndex * this.hexSpacingX;
        this.targetOffset = projectPosition - viewportCenter + (this.hexWidth / 2);
        this.isNavigating = true;
        
        // Update active dot
        this.updateActiveNavDot(projectIndex);
        
        // Smooth transition to target
        const smoothTransition = () => {
            const diff = this.targetOffset - this.carouselOffset;
            if (Math.abs(diff) > 1) {
                this.carouselOffset += diff * 0.1; // Smooth easing
                requestAnimationFrame(smoothTransition);
            } else {
                this.carouselOffset = this.targetOffset;
                this.isNavigating = false;
            }
        };
        
        smoothTransition();
    }
    
    updateActiveNavDot(projectIndex) {
        const navItems = this.navDotsContainer.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            if (index === projectIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    getCurrentCenterProject() {
        // Calculate which project is currently in the center
        const centerOffset = this.carouselOffset + (window.innerWidth / 2);
        let projectIndex = Math.round(centerOffset / this.hexSpacingX) % this.totalProjects;
        
        // Ensure positive index
        if (projectIndex < 0) {
            projectIndex = (projectIndex + this.totalProjects) % this.totalProjects;
        }
        
        return Math.max(0, Math.min(this.totalProjects - 1, projectIndex));
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
                { title: 'Job Nest', tech: 'MERN Stack', description: 'A comprehensive platform for job seekers and employers with advanced matching algorithms', icon: '💼', color: '#667eea', github: 'https://github.com/masterunix/JobNest-v1', visit: 'Will be deployed soon' },
                { title: '450 House of Sourdough', tech: 'Modern Web Stack', description: 'Elegant website for artisanal sourdough bakery with e-commerce integration', icon: '🍞', color: '#d4a574', github: 'Available on request', visit: '450houseofsourdough.com' },
                { title: 'movie_fy', tech: 'Flutter, Dart', description: 'Feature-rich mobile app for movie enthusiasts with reviews and recommendations', icon: '🎬', color: '#e74c3c', github: 'https://github.com/masterunix/Fluttter-Movie-App', visit: null },
                { title: 'Mobile Dev Project', tech: 'React Native', description: 'Cross-platform mobile application with native performance and modern UI', icon: '📱', color: '#61dafb', github: 'Coming Soon', visit: null },
                { title: 'WalterWins', tech: 'Full Stack', description: 'In-progress online gaming platform with real-time multiplayer capabilities', icon: '🎮', color: '#9b59b6', github: 'In Development', visit: null },
                { title: 'Personal DIY Server', tech: 'Ubuntu, Nginx', description: 'Custom-built server infrastructure from repurposed hardware with enterprise features', icon: '🖥️', color: '#34495e', github: 'Private', visit: 'Request Access' },
                { title: 'Jarvis 2.0', tech: 'AI/ML, Python', description: 'Advanced AI assistant with natural language processing and smart automation', icon: '🤖', color: '#f39c12', github: 'Coming Soon', visit: null },
                { title: 'AI ML Project', tech: 'TensorFlow, PyTorch', description: 'Cutting-edge machine learning solution for data analysis and prediction', icon: '🧠', color: '#e67e22', github: 'In Development', visit: null },
                { title: 'AI ML Project 2', tech: 'Deep Learning', description: 'Advanced neural network implementation for computer vision applications', icon: '👁️', color: '#3498db', github: 'Coming Soon', visit: null },
                { title: 'Cyber Security Project', tech: 'Security Tools', description: 'Comprehensive cybersecurity solution with threat detection and prevention', icon: '🔒', color: '#e74c3c', github: 'Coming Soon', visit: null },
                { title: 'DSA Stats', tech: 'Data Structures', description: 'Explore coding achievements and algorithm mastery statistics', icon: '📊', color: '#2ecc71', github: null, visit: 'dsa.html' },
                { title: 'Skills & Journey', tech: 'Career Path', description: 'Discover technical skills, experience timeline, and professional growth', icon: '🎯', color: '#9b59b6', github: null, visit: 'skills.html' },
                { title: 'Upcoming Project', tech: 'TBD', description: 'Exciting new project in planning phase with innovative features', icon: '🚀', color: '#95a5a6', github: 'Coming Soon', visit: null },
                { title: 'Future Innovation', tech: 'Next-Gen Tech', description: 'Revolutionary project leveraging emerging technologies and modern frameworks', icon: '✨', color: '#f1c40f', github: 'Coming Soon', visit: null }
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
            
            // Add action buttons for specific projects
            const projectActions = document.createElement('div');
            projectActions.className = 'project-actions';
            
            if (project.github && project.github !== 'Coming Soon' && project.github !== 'In Development' && project.github !== 'Private' && project.github !== 'Available on request') {
                const githubBtn = document.createElement('a');
                githubBtn.href = project.github;
                githubBtn.target = '_blank';
                githubBtn.className = 'project-btn github-btn';
                githubBtn.textContent = 'GitHub';
                githubBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.github, '_blank');
                });
                projectActions.appendChild(githubBtn);
            }
            
            if (project.visit && project.visit !== 'Will be deployed soon') {
                if (project.visit === 'Request Access') {
                    const requestBtn = document.createElement('a');
                    requestBtn.href = "mailto:vatsalgoyal9999@gmail.com?subject=Server Access Request&body=Hey! I'd like to explore more about your personal server and ssh access for it.";
                    requestBtn.className = 'project-btn request-btn';
                    requestBtn.textContent = 'Request Access';
                    requestBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = "mailto:vatsalgoyal9999@gmail.com?subject=Server Access Request&body=Hey! I'd like to explore more about your personal server and ssh access for it.";
                    });
                    projectActions.appendChild(requestBtn);
                } else if (project.visit === 'dsa.html' || project.visit === 'skills.html') {
                    const visitBtn = document.createElement('a');
                    visitBtn.href = project.visit;
                    visitBtn.className = 'project-btn visit-btn';
                    visitBtn.textContent = 'Explore';
                    visitBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = project.visit;
                    });
                    projectActions.appendChild(visitBtn);
                } else {
                    const visitBtn = document.createElement('a');
                    visitBtn.href = `https://${project.visit}`;
                    visitBtn.target = '_blank';
                    visitBtn.className = 'project-btn visit-btn';
                    visitBtn.textContent = 'Visit';
                    visitBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://${project.visit}`, '_blank');
                    });
                    projectActions.appendChild(visitBtn);
                }
            }
            
            hexContent.appendChild(projectIcon);
            hexContent.appendChild(projectTitle);
            hexContent.appendChild(projectTech);
            hexContent.appendChild(projectDescription);
            if (projectActions.children.length > 0) {
                hexContent.appendChild(projectActions);
            }
            hex.classList.add('project-hex');
            
        } else { // Top and bottom rows - Technologies
            const technologies = [
                { title: 'MongoDB', tech: 'NoSQL Database', description: 'Document-based database', icon: '🍃', color: '#47a248' },
                { title: 'React', tech: 'Frontend Library', description: 'Component-based UI', icon: '⚛️', color: '#61dafb' },
                { title: 'Flutter', tech: 'Mobile Framework', description: 'Cross-platform development', icon: '📱', color: '#02569b' },
                { title: 'React Native', tech: 'Mobile Development', description: 'Native mobile apps', icon: '📲', color: '#61dafb' },
                { title: 'Node.js', tech: 'Backend Runtime', description: 'Server-side JavaScript', icon: '🟢', color: '#339933' },
                { title: 'Ubuntu Server', tech: 'Linux Distribution', description: 'Server operating system', icon: '🐧', color: '#e95420' },
                { title: 'Python', tech: 'Programming Language', description: 'AI/ML development', icon: '🐍', color: '#3776ab' },
                { title: 'TensorFlow', tech: 'ML Framework', description: 'Deep learning library', icon: '🧠', color: '#ff6f00' },
                { title: 'PyTorch', tech: 'ML Framework', description: 'Neural network library', icon: '🔥', color: '#ee4c2c' },
                { title: 'Nginx', tech: 'Web Server', description: 'Reverse proxy server', icon: '🌐', color: '#009639' },
                { title: 'JavaScript', tech: 'Programming Language', description: 'Web development', icon: '⚡', color: '#f7df1e' },
                { title: 'HTML/CSS', tech: 'Web Technologies', description: 'Frontend markup & styling', icon: '🎨', color: '#e34f26' },
                { title: 'Express.js', tech: 'Backend Framework', description: 'Node.js web framework', icon: '🚀', color: '#000000' },
                { title: 'Dart', tech: 'Programming Language', description: 'Flutter development', icon: '🎯', color: '#0175c2' }
            ];
            
            const tech = technologies[col % technologies.length];
            
            const techIcon = document.createElement('div');
            techIcon.className = 'tech-icon';
            techIcon.textContent = tech.icon;
            techIcon.style.background = `linear-gradient(135deg, ${tech.color} 0%, ${this.adjustColor(tech.color, -20)} 100%)`;
            
            const techTitle = document.createElement('div');
            techTitle.className = 'tech-title';
            techTitle.textContent = tech.title;
            
            const techType = document.createElement('div');
            techType.className = 'tech-type';
            techType.textContent = tech.tech;
            
            const techDescription = document.createElement('div');
            techDescription.className = 'tech-description';
            techDescription.textContent = tech.description;
            
            hexContent.appendChild(techIcon);
            hexContent.appendChild(techTitle);
            hexContent.appendChild(techType);
            hexContent.appendChild(techDescription);
            hex.classList.add('tech-hex');
        }
        
        hex.appendChild(hexContent);
        
        // Add entrance animation
        hex.style.opacity = '0';
        hex.style.animation = `fadeInUp 0.15s ease-out forwards`;
        hex.style.animationDelay = `${(row * 14 + col + set * 42) * 8}ms`; // 8ms stagger
        
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
    
    startCarousel() {
        let lastUpdateTime = 0;
        
        const animate = (currentTime) => {
            // Only auto-scroll when not navigating
            if (!this.isNavigating && currentTime - lastUpdateTime > 16) { // ~60fps
                this.carouselOffset += this.carouselSpeed;
                lastUpdateTime = currentTime;
                
                // Update active nav dot based on current center project
                const centerProject = this.getCurrentCenterProject();
                this.updateActiveNavDot(centerProject);
            }
            
            // Update hexagon positions for all rows
            const hexagons = this.container.querySelectorAll('.hex');
            hexagons.forEach((hex, index) => {
                const totalHexagons = 42; // 3 rows × 14 cols = 42 hexagons per set
                const setIndex = Math.floor(index / totalHexagons);
                const hexInSet = index % totalHexagons;
                const row = Math.floor(hexInSet / 14);
                const col = hexInSet % 14;
                
                // Move all rows, not just center row
                const offsetX = (row % 2 === 1) ? this.hexSpacingX / 2 : 0;
                const baseX = col * this.hexSpacingX + offsetX;
                const setOffset = setIndex * (this.totalProjects * this.hexSpacingX);
                const x = baseX + setOffset - this.carouselOffset;
                
                // Wrap around for seamless looping - start from left edge
                const totalWidth = this.totalProjects * this.hexSpacingX * 3; // 3 sets
                let wrappedX = ((x % totalWidth) + totalWidth) % totalWidth;
                
                // Shift to start from left edge instead of having empty space
                wrappedX = wrappedX - this.hexSpacingX;
                
                hex.style.left = wrappedX + 'px';
            });
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
    
    setupEventListeners() {
        // Arrow key navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentProject = this.getCurrentCenterProject();
                const prevProject = (currentProject - 1 + this.totalProjects) % this.totalProjects;
                this.navigateToProject(prevProject);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const currentProject = this.getCurrentCenterProject();
                const nextProject = (currentProject + 1) % this.totalProjects;
                this.navigateToProject(nextProject);
            }
        });

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

        // Project click handlers - allow buttons to work
        this.container.addEventListener('click', (e) => {
            // Don't interfere with button clicks
            if (e.target.closest('.project-btn')) {
                return;
            }
            
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ProjectsHoneycomb');
    try {
        // Save instance globally to allow re-initialization on BFCache restore
        window.projectsSite = new ProjectsHoneycomb();
        console.log('ProjectsHoneycomb initialized successfully');
        
        // Entrance animation is now handled in createHexagon method
    } catch (error) {
        console.error('Error initializing ProjectsHoneycomb:', error);
    }
});

// Ensure proper state when returning via browser back/forward (BFCache)
window.addEventListener('pageshow', (event) => {
    try {
        const isBFCacheRestore = event.persisted ||
            (performance && performance.getEntriesByType &&
             performance.getEntriesByType('navigation')[0]?.type === 'back_forward');

        if (isBFCacheRestore) {
            if (window.projectsSite) {
                window.projectsSite.computeSizing();
                window.projectsSite.generateProjectHoneycomb();
                window.projectsSite.createNavigator();
            } else {
                const container = document.getElementById('honeycomb-container');
                if (container) {
                    container.querySelectorAll('.hex').forEach((hex) => {
                        hex.style.opacity = '';
                        hex.style.animation = '';
                        hex.classList.remove('fade-in');
                    });
                }
            }
        }
    } catch (e) {
        console.error('projects pageshow handler error:', e);
    }
});
