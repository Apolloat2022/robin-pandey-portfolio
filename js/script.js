// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        menuToggle.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', isActive ? 'Close menu' : 'Open menu');
    });
    
    // Close menu when clicking links (excluding dropdown triggers)
    document.querySelectorAll('.nav-links a:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            // Also reset dropdowns
            const dropdownMenu = document.querySelector('.dropdown-menu');
            const dropdownItem = document.querySelector('.dropdown-item');
            if (dropdownMenu) dropdownMenu.classList.remove('active');
            if (dropdownItem) dropdownItem.classList.remove('open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Open menu');
            
            const dropdownMenu = document.querySelector('.dropdown-menu');
            const dropdownItem = document.querySelector('.dropdown-item');
            if (dropdownMenu) dropdownMenu.classList.remove('active');
            if (dropdownItem) dropdownItem.classList.remove('open');
        }
    });
}

// 1. Mobile Dropdown Toggle Logic
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdownItem = document.querySelector('.dropdown-item');

if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
        // Only trigger click behavior on mobile screens
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Stop it from jumping immediately
            if (dropdownMenu) dropdownMenu.classList.toggle('active');
            if (dropdownItem) dropdownItem.classList.toggle('open');
        }
    });
}

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 2. The Smart Filter Function
function activateFilter(category) {
    // Close mobile nav if it's open
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownItem = document.querySelector('.dropdown-item');
    
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Open menu');
        }
        // Reset the dropdown icon state
        if (dropdownItem) dropdownItem.classList.remove('open');
        if (dropdownMenu) dropdownMenu.classList.remove('active');
    }

    // Scroll smoothly to the section
    const section = document.getElementById('applications');
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }

    // Wait 300ms for scroll to start, then trigger the filter
    setTimeout(() => {
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }, 300);
}

// Update current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Form Submission - Formspree Integration
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Formspree will handle the actual submission
        // No need for e.preventDefault() - let the form submit to Formspree
        
        // Reset button state after form submission
        setTimeout(() => {
            // This runs after Formspree processes the form
            if (this.checkValidity()) {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Optional: Reset form after success
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    this.reset();
                }, 2000);
            } else {
                // If form is invalid, reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }, 500);
        
        // Note: Formspree will redirect to their success page
        // You can customize this in Formspree dashboard settings
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    menuToggle.setAttribute('aria-label', 'Open menu');
                }
            }
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards for animation
projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Add hover effect to project cards (only on non-touch devices)
if (window.matchMedia('(hover: hover)').matches) {
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.style.display || card.style.display !== 'none') {
                card.style.transform = 'translateY(0)';
            }
        });
    });
}

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-label', 'Open menu');
            }
        }
    }, 250);
});