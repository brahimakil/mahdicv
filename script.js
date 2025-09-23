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

function updateLoadingProgress() {
    loadedAssets++;
    if (loadedAssets >= totalAssets) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initializeAnimations();
        }, 500);
    }
}

// Function to load media from Firebase Storage
async function loadMediaFromFirebase() {
    try {
        // Load profile image
        const profileImageRef = ref(storage, mediaFiles.profileImage);
        const profileImageUrl = await getDownloadURL(profileImageRef);
        const profileImg = document.getElementById('profileImage');
        profileImg.src = profileImageUrl;
        profileImg.onload = updateLoadingProgress;
        profileImg.onerror = () => {
            console.error('Failed to load profile image');
            updateLoadingProgress();
        };

        // Load hero image 1
        const heroImage1Ref = ref(storage, mediaFiles.heroImage1);
        const heroImage1Url = await getDownloadURL(heroImage1Ref);
        const heroImg1 = document.getElementById('heroImage1');
        heroImg1.src = heroImage1Url;
        heroImg1.onload = updateLoadingProgress;
        heroImg1.onerror = () => {
            console.error('Failed to load hero image 1');
            updateLoadingProgress();
        };

        // Load hero image 2
        const heroImage2Ref = ref(storage, mediaFiles.heroImage2);
        const heroImage2Url = await getDownloadURL(heroImage2Ref);
        const heroImg2 = document.getElementById('heroImage2');
        heroImg2.src = heroImage2Url;
        heroImg2.onload = updateLoadingProgress;
        heroImg2.onerror = () => {
            console.error('Failed to load hero image 2');
            updateLoadingProgress();
        };

        // Load profile video
        const profileVideoRef = ref(storage, mediaFiles.profileVideo);
        const profileVideoUrl = await getDownloadURL(profileVideoRef);
        const profileVideo = document.getElementById('profileVideo');
        profileVideo.src = profileVideoUrl;
        profileVideo.poster = heroImage1Url; // Use first hero image as poster
        profileVideo.onloadeddata = updateLoadingProgress;
        profileVideo.onerror = () => {
            console.error('Failed to load profile video');
            updateLoadingProgress();
        };

    } catch (error) {
        console.error('Error loading media from Firebase:', error);
        // Hide loading screen even if there's an error
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initializeAnimations();
        }, 1000);
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
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Create mailto link
            const mailtoLink = `mailto:mahdikandil4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Thank you for your message! Your email client should open now.', 'success');
            
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
document.addEventListener('DOMContentLoaded', () => {
    // Hide body overflow during loading
    document.body.style.overflow = 'hidden';
    
    // Load media from Firebase
    loadMediaFromFirebase();
    
    // Optimize images
    optimizeImages();
    
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
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Handle Firebase errors gracefully
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});