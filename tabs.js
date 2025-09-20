document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn, .mobile-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const hamburger = document.querySelector('.hamburger');
    let isAnimating = false;
    let currentTab = 'home';
    
    // Function to switch tabs with 3D animation
    function switchTab(tabId, direction = 'right') {
        if (isAnimating || !tabId || currentTab === tabId) return;
        
        isAnimating = true;
        const previousTab = currentTab;
        currentTab = tabId;
        
        // Get the current and next panes
        const currentPane = document.getElementById(previousTab);
        const nextPane = document.getElementById(tabId);
        
        if (!nextPane) {
            isAnimating = false;
            return;
        }
        
        // Set initial states
        nextPane.style.transform = direction === 'right' 
            ? 'rotateY(90deg) translateX(100px) scale(0.9)' 
            : 'rotateY(-90deg) translateX(-100px) scale(0.9)';
        nextPane.style.opacity = '0';
        nextPane.style.display = 'block';
        nextPane.style.pointerEvents = 'none';
        
        // Start animation
        requestAnimationFrame(() => {
            // Fade out current tab
            if (currentPane) {
                currentPane.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                currentPane.style.transform = direction === 'right' 
                    ? 'rotateY(-90deg) translateX(-100px) scale(0.9)' 
                    : 'rotateY(90deg) translateX(100px) scale(0.9)';
                currentPane.style.opacity = '0';
            }
            
            // Fade in next tab
            nextPane.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            nextPane.style.transform = 'rotateY(0) translateX(0) scale(1)';
            nextPane.style.opacity = '1';
            
            // Update active states after animation
            setTimeout(() => {
                // Reset current pane
                if (currentPane) {
                    currentPane.style.display = 'none';
                    currentPane.style.transform = '';
                    currentPane.style.transition = '';
                    currentPane.classList.remove('active');
                }
                
                // Set next pane as active
                nextPane.style.display = 'block';
                nextPane.style.pointerEvents = 'auto';
                nextPane.classList.add('active');
                
                // Update buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('data-tab') === tabId) {
                        btn.classList.add('active');
                    }
                });
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Update URL hash
                window.location.hash = tabId;
                
                isAnimating = false;
            }, 600);
        });
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Toggle hamburger animation
        const bars = document.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            // Animate to X
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            // Revert to hamburger
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }
    
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Handle initial tab based on URL hash
    function setInitialTab() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['home', 'about', 'cv', 'projects', 'skills', 'services', 'contact'];
        
        if (hash && validTabs.includes(hash)) {
            switchTab(hash);
        } else {
            // Default to home tab
            switchTab('home');
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', setInitialTab);
    
    // Initialize
    setInitialTab();
});
