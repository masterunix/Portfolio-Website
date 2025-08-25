// Mobile DSA functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        initializeMobileDSA();
    }
    
    // Re-initialize on resize if switching to mobile
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initializeMobileDSA();
        }
    });
});

function initializeMobileDSA() {
    const mobileItems = document.querySelectorAll('.mobile-content-item[data-link]');
    
    mobileItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const link = this.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
        
        // Add cursor pointer style
        item.style.cursor = 'pointer';
    });
}
