/**
 * Unified Mobile Functionality
 * Handles mobile-specific UI elements, notices, and interactions across the portfolio.
 */

(function() {
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // --- Mobile Notice Banner ---
    function createMobileNotice() {
        if (document.getElementById('mobile-notice-banner')) return;
        
        const notice = document.createElement('div');
        notice.id = 'mobile-notice-banner';
        notice.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 102, 0, 0.95);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            pointer-events: none;
            text-align: center;
            width: 80%;
            max-width: 300px;
        `;
        notice.innerHTML = '✨ Mobile View Active';
        document.body.appendChild(notice);

        // Hide desktop copyright on mobile if it exists
        const copyright = document.getElementById('copyright');
        if (copyright) copyright.style.display = 'none';
    }

    // --- Helper: File Downloader ---
    function downloadFile(path, filename) {
        fetch(path)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(() => window.open(path, '_blank'));
    }

    // --- Page Initializers ---
    function initProjects() {
        document.querySelectorAll('.mobile-link:not(.disabled)').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const type = this.getAttribute('data-type');
                const item = this.closest('.mobile-content-item');
                if (type === 'github') {
                    const url = item.getAttribute('data-github');
                    if (url && url.startsWith('http')) window.open(url, '_blank');
                } else if (type === 'visit') {
                    const url = item.getAttribute('data-visit');
                    if (url) {
                        if (url.endsWith('.html')) window.location.href = url;
                        else window.open(url.includes('.') ? 'https://' + url : url, '_blank');
                    }
                }
            });
        });
    }

    function initResumes() {
        document.querySelectorAll('.mobile-download-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filename = this.closest('.mobile-content-item').getAttribute('data-filename');
                if (filename) downloadFile(`Assets/Resumes/${filename}`, filename);
            });
        });
    }

    function initSkills() {
        document.querySelectorAll('.mobile-download-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filename = this.getAttribute('data-filename') || this.closest('.mobile-content-item')?.getAttribute('data-filename');
                if (filename) downloadFile(`Assets/Certifcations etc/${filename}`, filename);
            });
        });
    }

    function initDSA() {
        document.querySelectorAll('.mobile-content-item[data-link]').forEach(item => {
            item.addEventListener('click', () => {
                const link = item.getAttribute('data-link');
                if (link) window.open(link, '_blank');
            });
            item.style.cursor = 'pointer';
        });
    }

    // --- Main Initializer ---
    function main() {
        if (!isMobile()) {
            const banner = document.getElementById('mobile-notice-banner');
            if (banner) banner.remove();
            const copyright = document.getElementById('copyright');
            if (copyright) copyright.style.display = 'block';
            return;
        }

        createMobileNotice();

        const path = window.location.pathname;
        if (path.includes('projects.html')) initProjects();
        else if (path.includes('resumes.html')) initResumes();
        else if (path.includes('skills.html')) initSkills();
        else if (path.includes('dsa.html')) initDSA();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    window.addEventListener('resize', main);
})();
