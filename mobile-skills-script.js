// Mobile skills functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        initializeMobileSkills();
    }
    
    // Re-initialize on resize if switching to mobile
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initializeMobileSkills();
        }
    });
});

function initializeMobileSkills() {
    const downloadBtns = document.querySelectorAll('.mobile-download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            let filename = this.getAttribute('data-filename');
            
            // If button doesn't have filename, check parent item
            if (!filename) {
                const item = this.closest('.mobile-content-item');
                filename = item ? item.getAttribute('data-filename') : null;
            }
            
            if (filename) {
                // Force download by fetching as blob and creating object URL
                fetch(`Assets/Certifcations etc/${filename}`)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.style.display = 'none';
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up the object URL
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Download failed:', error);
                        // Fallback to direct link if fetch fails
                        const link = document.createElement('a');
                        link.href = `Assets/Certifcations etc/${filename}`;
                        link.download = filename;
                        link.target = '_blank';
                        link.style.display = 'none';
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
            }
        });
    });
}
