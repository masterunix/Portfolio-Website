// Mobile Notice System - Site-wide implementation
(function() {
    'use strict';
    
    // Only run on mobile devices
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function createMobileNotice() {
        // Check if notice already exists
        if (document.getElementById('mobile-notice-banner')) {
            return;
        }
        
        // Create the notice element
        const notice = document.createElement('div');
        notice.id = 'mobile-notice-banner';
        notice.innerHTML = 'This website is designed to be viewed in desktop mode. This is a barebones, functional experience without animations and contains less information as well. <span style="margin-left: 15px; color: #999; font-size: 10px;">© 2025 Vatsal Goyal. All rights reserved.</span>';
        
        // Apply styles
        notice.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: #FFD700;
            font-size: 11px;
            padding: 8px 12px;
            text-align: center;
            z-index: 9999;
            line-height: 1.3;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
            font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        `;
        
        // Add to page
        document.body.appendChild(notice);
        
        // Hide desktop copyright on mobile
        const copyright = document.getElementById('copyright');
        if (copyright) {
            copyright.style.display = 'none';
        }
    }
    
    function removeMobileNotice() {
        const notice = document.getElementById('mobile-notice-banner');
        if (notice) {
            notice.remove();
        }
        
        // Show desktop copyright again
        const copyright = document.getElementById('copyright');
        if (copyright) {
            copyright.style.display = 'block';
        }
    }
    
    function handleResize() {
        if (isMobile()) {
            createMobileNotice();
        } else {
            removeMobileNotice();
        }
    }
    
    // Initialize when DOM is loaded
    function init() {
        if (isMobile()) {
            createMobileNotice();
        }
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
