// Mobile resumes functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        initializeMobileResumes();
    }
    
    // Re-initialize on resize if switching to mobile
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initializeMobileResumes();
        }
    });
});

function initializeMobileResumes() {
    const downloadBtns = document.querySelectorAll('.mobile-download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = this.closest('.mobile-content-item');
            const filename = item.getAttribute('data-filename');
            
            if (filename) {
                // Force download by fetching as blob and creating object URL
                fetch(`Assets/Resumes/${filename}`)
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
                        link.href = `Assets/Resumes/${filename}`;
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
