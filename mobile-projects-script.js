// Mobile projects functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        initializeMobileProjects();
    }
    
    // Re-initialize on resize if switching to mobile
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initializeMobileProjects();
        }
    });
});

function initializeMobileProjects() {
    const mobileLinks = document.querySelectorAll('.mobile-link:not(.disabled)');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = this.getAttribute('data-type');
            const item = this.closest('.mobile-content-item');
            
            if (type === 'github') {
                const githubUrl = item.getAttribute('data-github');
                if (githubUrl && githubUrl.startsWith('http')) {
                    window.open(githubUrl, '_blank');
                }
            } else if (type === 'visit') {
                const visitUrl = item.getAttribute('data-visit');
                if (visitUrl) {
                    if (visitUrl.endsWith('.html')) {
                        // Internal navigation
                        window.location.href = visitUrl;
                    } else if (visitUrl.includes('.')) {
                        // External website
                        window.open('https://' + visitUrl, '_blank');
                    }
                }
            }
        });
    });
}
