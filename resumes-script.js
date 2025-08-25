class ResumesWebsite {
    constructor() {
        this.container = document.getElementById('honeycomb-container');
        this.backBtn = document.getElementById('back-btn');
        
        // Initial sizing
        this.computeSizing();
        
        // Debounce resize handler
        this.resizeTimeout = null;
        
        this.init();
    }
    
    typeHeaderText() {
        const headerElement = document.querySelector('#main-header h1');
        const text = "Different Domains, Different Resumes";
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
        this.typeHeaderText();
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
        
        // Resume content for specific hexagons
        const resumeContent = {
            '1-1': { 
                domain: 'Basic Resume',
                description: 'General purpose resume',
                filename: 'Basic.pdf',
                color: '#667eea',
                stars: 0,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>'
            },
            '1-2': { 
                domain: 'Full Stack Development',
                description: 'Frontend, Backend & Databases',
                filename: 'Full Stack.pdf',
                color: '#4ecdc4',
                stars: 4,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>'
            },
            '1-3': { 
                domain: 'SDE',
                description: 'Software Development Engineer',
                filename: 'SDE.pdf',
                color: '#ff6b6b',
                stars: 3.5,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/></svg>'
            },
            '1-4': { 
                domain: 'ML Engineer / Data Scientist',
                description: 'Machine Learning & AI',
                filename: 'ML: AI.pdf',
                color: '#feca57',
                stars: 3.5,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>'
            },
            '1-5': { 
                domain: 'Mobile Developer',
                description: 'iOS & Android Apps',
                filename: 'Mobile Developer.pdf',
                color: '#a8e6cf',
                stars: 3,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/></svg>'
            },
            '2-2': { 
                domain: 'Embedded Systems',
                description: 'Firmware & Microcontrollers',
                filename: 'Embedded Systems.pdf',
                color: '#ff9ff3',
                stars: 3,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/></svg>'
            },
            '2-3': { 
                domain: 'Quant Developer',
                description: 'Financial Engineering',
                filename: 'Quant Developer.pdf',
                color: '#54a0ff',
                stars: 3,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/></svg>'
            },
            '2-4': { 
                domain: 'CyberSecurity',
                description: 'Security & Compliance',
                filename: 'CyberSecurity.pdf',
                color: '#5f27cd',
                stars: 3,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.1,7 14,7.9 14,9C14,10.1 13.1,11 12,11C10.9,11 10,10.1 10,9C10,7.9 10.9,7 12,7Z"/></svg>'
            },
            '2-5': { 
                domain: 'Feedback',
                description: 'Share your thoughts',
                email: 'vatsalgoyal9999@gmail.com',
                color: '#00d2d3',
                stars: 0,
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>'
            }
        };
        
        if (resumeContent[hexId]) {
            const item = resumeContent[hexId];
            
            // Icon container
            const iconDiv = document.createElement('div');
            iconDiv.className = 'hex-icon';
            iconDiv.innerHTML = item.icon;
            iconDiv.style.background = `linear-gradient(135deg, ${item.color} 0%, ${this.adjustColor(item.color, -20)} 100%)`;
            
            // Domain name (bold)
            const domainSpan = document.createElement('span');
            domainSpan.className = 'hex-domain';
            domainSpan.innerHTML = `<strong>${item.domain}</strong>`;
            
            // Description
            const descSpan = document.createElement('span');
            descSpan.className = 'hex-description';
            descSpan.textContent = item.description;
            
            hexContent.appendChild(iconDiv);
            hexContent.appendChild(domainSpan);
            hexContent.appendChild(descSpan);
            
            // Star rating (if has stars > 0)
            if (item.stars > 0) {
                const starsDiv = document.createElement('div');
                starsDiv.className = 'hex-stars';
                starsDiv.innerHTML = this.createStarRating(item.stars);
                hexContent.appendChild(starsDiv);
            }
            
            // Download button (if has filename)
            if (item.filename) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'hex-download-btn';
                downloadBtn.textContent = 'Download';
                downloadBtn.style.pointerEvents = 'auto';
                downloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`./Assets/Resumes/${item.filename}`, '_blank');
                });
                hexContent.appendChild(downloadBtn);
            }
            
            // Email button (for feedback hexagon)
            if (item.email) {
                const emailBtn = document.createElement('button');
                emailBtn.className = 'hex-email-btn';
                emailBtn.textContent = 'Send Email';
                emailBtn.style.pointerEvents = 'auto';
                emailBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const emailBody = encodeURIComponent("I came from vatsalgoyal.me's resume section and I have feedback for you:\n\n");
                    window.open(`mailto:${item.email}?subject=Portfolio Feedback&body=${emailBody}`, '_blank');
                });
                hexContent.appendChild(emailBtn);
            }
            
            hex.classList.add('resume-hex');
        } else {
            // Leave empty hexagons without any content
        }
        
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

        // Add click handlers for resume hexagons
        this.container.addEventListener('click', (e) => {
            const hex = e.target.closest('.hex');
            if (hex && hex.classList.contains('resume-hex')) {
                const filename = hex.getAttribute('data-filename');
                if (filename) {
                    this.downloadResume(filename);
                }
            }
        });
    }
    
    downloadResume(filename) {
        // Show download status
        this.showDownloadStatus(`Downloading ${filename}...`);
        
        // Create download link with correct path
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = `./Assets/Resumes/${filename}`;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // Try to download
            try {
                link.click();
                this.showDownloadStatus(`${filename} downloaded successfully!`, 'success');
            } catch (error) {
                this.showDownloadStatus(`Download failed. Please try again.`, 'error');
            }
            
            document.body.removeChild(link);
        }, 500);
    }
    
    showDownloadStatus(message, type = 'success') {
        // Remove existing status
        const existingStatus = document.querySelector('.download-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Create new status
        const status = document.createElement('div');
        status.className = `download-status ${type === 'error' ? 'error' : ''}`;
        status.textContent = message;
        document.body.appendChild(status);
        
        // Show status
        setTimeout(() => {
            status.classList.add('show');
        }, 100);
        
        // Hide status after 3 seconds
        setTimeout(() => {
            status.classList.remove('show');
            setTimeout(() => {
                if (status.parentNode) {
                    status.remove();
                }
            }, 300);
        }, 3000);
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
    console.log('DOM loaded, initializing ResumesWebsite');
    try {
        new ResumesWebsite();
        console.log('ResumesWebsite initialized successfully');
    } catch (error) {
        console.error('Error initializing ResumesWebsite:', error);
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
