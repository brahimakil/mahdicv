// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Media file references
const mediaFiles = {
    profileImage: 'mahdicv/mahdi.jpg',
    heroImage1: 'mahdicv/mahdi1.jpg',
    heroImage2: 'mahdicv/mahdi2.jpg',
    profileVideo: 'mahdicv/mahdi Bruges0websit.mp4'
};

// Loading screen management
const loadingScreen = document.getElementById('loadingScreen');
let loadedAssets = 0;
const totalAssets = Object.keys(mediaFiles).length;

// Replace the updateLoadingProgress function with this simpler version
function updateLoadingProgress() {
    // This function is no longer needed since we're not tracking multiple assets
    // The loading screen will be hidden as soon as the profile image loads
}

// Function to load media from Firebase Storage
// Replace the existing loadMediaFromFirebase function with this optimized version

async function loadMediaFromFirebase() {
    try {
        // Only load the profile image initially for fast loading
        const profileImageRef = ref(storage, mediaFiles.profileImage);
        const profileImageUrl = await getDownloadURL(profileImageRef);
        const profileImg = document.getElementById('profileImage');
        profileImg.src = profileImageUrl;
        
        // Hide loading screen immediately after profile image loads
        profileImg.onload = () => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initializeAnimations();
            
            // Load other images lazily in the background
            loadOtherImagesLazily();
        };
        
        profileImg.onerror = () => {
            console.error('Failed to load profile image');
            // Still hide loading screen even if profile image fails
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initializeAnimations();
            loadOtherImagesLazily();
        };

    } catch (error) {
        console.error('Error loading profile image from Firebase:', error);
        // Hide loading screen even if there's an error
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initializeAnimations();
    }
}

// Load other images in the background after the site is already visible
async function loadOtherImagesLazily() {
    try {
        // Load hero images in background
        const heroImage1Ref = ref(storage, mediaFiles.heroImage1);
        const heroImage1Url = await getDownloadURL(heroImage1Ref);
        const heroImg1 = document.getElementById('heroImage1');
        if (heroImg1) {
            heroImg1.src = heroImage1Url;
        }

        const heroImage2Ref = ref(storage, mediaFiles.heroImage2);
        const heroImage2Url = await getDownloadURL(heroImage2Ref);
        const heroImg2 = document.getElementById('heroImage2');
        if (heroImg2) {
            heroImg2.src = heroImage2Url;
        }

        // Set up video to load only when clicked
        setupVideoLazyLoading(heroImage1Url);

    } catch (error) {
        console.error('Error loading additional media:', error);
    }
}

// Setup video to load only when user clicks on it
async function setupVideoLazyLoading(posterUrl) {
    const videoContainer = document.querySelector('.video-container');
    const video = document.getElementById('profileVideo');
    const videoOverlay = document.querySelector('.video-overlay');

    if (video && videoOverlay) {
        // Set poster image
        video.poster = posterUrl;
        
        // Load video only when user clicks
        let videoLoaded = false;
        
        const loadVideo = async () => {
            if (!videoLoaded) {
                try {
                    const profileVideoRef = ref(storage, mediaFiles.profileVideo);
                    const profileVideoUrl = await getDownloadURL(profileVideoRef);
                    video.src = profileVideoUrl;
                    videoLoaded = true;
                    
                    // Show loading indicator
                    videoOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    video.onloadeddata = () => {
                        videoOverlay.innerHTML = '<i class="fas fa-play"></i>';
                        video.play();
                        videoOverlay.style.opacity = '0';
                    };
                } catch (error) {
                    console.error('Error loading video:', error);
                    videoOverlay.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                }
            } else {
                video.play();
                videoOverlay.style.opacity = '0';
            }
        };

        videoOverlay.addEventListener('click', loadVideo);
        video.addEventListener('click', () => {
            if (videoLoaded) {
                if (video.paused) {
                    video.play();
                    videoOverlay.style.opacity = '0';
                } else {
                    video.pause();
                    videoOverlay.style.opacity = '1';
                }
            } else {
                loadVideo();
            }
        });

        video.addEventListener('ended', () => {
            videoOverlay.style.opacity = '1';
            videoOverlay.innerHTML = '<i class="fas fa-play"></i>';
        });
    }
}

// Initialize animations and interactions
function initializeAnimations() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
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

    // Observe elements for animation
    document.querySelectorAll('.project-card, .skill-item, .award-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Video overlay functionality
    const videoContainer = document.querySelector('.video-container');
    const video = document.getElementById('profileVideo');
    const videoOverlay = document.querySelector('.video-overlay');

    if (videoOverlay && video) {
        videoOverlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                videoOverlay.style.opacity = '0';
            } else {
                video.pause();
                videoOverlay.style.opacity = '1';
            }
        });

        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                videoOverlay.style.opacity = '0';
            } else {
                video.pause();
                videoOverlay.style.opacity = '1';
            }
        });

        video.addEventListener('ended', () => {
            videoOverlay.style.opacity = '1';
        });
    }

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            const phone = formData.get('phone') || '';

            // Send to backend API
            try {
                const response = await fetch('https://molotov-backend.vercel.app/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        description: message,
                        phone: phone, // Use the actual phone value from form
                        selectedDate: '' // Optional field, can be empty
                    })
                });

                if (response.ok) {
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            }
            
            // Reset form
            contactForm.reset();
        });
    }

    // Parallax effect for floating images
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-image');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing animation for hero title
    const titleMain = document.querySelector('.title-main');
    if (titleMain) {
        const text = titleMain.textContent;
        titleMain.textContent = '';
        titleMain.style.borderRight = '2px solid var(--muted-sepia)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleMain.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    titleMain.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--muted-sepia);
        color: var(--warm-faded-highlight);
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.loading = 'lazy';
        
        // Add intersection observer for lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialize everything when DOM is loaded
// Replace the DOMContentLoaded section
document.addEventListener('DOMContentLoaded', () => {
    // Start loading only the profile image immediately
    loadMediaFromFirebase();
    
    // Initialize contact form and other non-media functionality
    initializeContactForm();
    initializeOtherFeatures();
});

function initializeContactForm() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone') || '';
            const subject = formData.get('subject');
            const message = formData.get('message');

            try {
                const response = await fetch('https://molotov-backend.vercel.app/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        description: message,
                        phone: phone,
                        selectedDate: ''
                    })
                });

                if (response.ok) {
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            }
            
            contactForm.reset();
        });
    }
}

function initializeOtherFeatures() {
    // All other non-media features can be initialized immediately
    // This includes animations, scroll effects, etc.
    
    // Add CSS for mobile navigation
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: var(--warm-faded-highlight);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 50px;
                transition: left 0.3s ease;
                z-index: 999;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 20px 0;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Handle Firebase errors gracefully
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});