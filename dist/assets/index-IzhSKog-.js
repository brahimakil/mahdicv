import{initializeApp as O}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getStorage as T,ref as g,getDownloadURL as h}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const F={apiKey:"AIzaSyDyrAaHvM5W6Zfdhr_wcrvF24hpkrFCgSA",authDomain:"molotovfilms.firebaseapp.com",projectId:"molotovfilms",storageBucket:"molotovfilms.firebasestorage.app",messagingSenderId:"830935437594",appId:"1:830935437594:web:d52e4a33538887cda69ca3",measurementId:"G-3H5Q6DYKM0"},q=O(F),y=T(q),u={profileImage:"mahdicv/mahdi.jpg",heroImage1:"mahdicv/mahdi1.jpg",heroImage2:"mahdicv/mahdi2.jpg",profileVideo:"mahdicv/mahdi Bruges0websit.mp4"},L=document.getElementById("loadingScreen");let E=0;const j=Object.keys(u).length;function p(){E++,E>=j&&setTimeout(()=>{L.classList.add("hidden"),document.body.style.overflow="auto",S()},500)}async function C(){try{const n=g(y,u.profileImage),s=await h(n),a=document.getElementById("profileImage");a.src=s,a.onload=p,a.onerror=()=>{console.error("Failed to load profile image"),p()};const l=g(y,u.heroImage1),e=await h(l),t=document.getElementById("heroImage1");t.src=e,t.onload=p,t.onerror=()=>{console.error("Failed to load hero image 1"),p()};const i=g(y,u.heroImage2),f=await h(i),d=document.getElementById("heroImage2");d.src=f,d.onload=p,d.onerror=()=>{console.error("Failed to load hero image 2"),p()};const m=g(y,u.profileVideo),o=await h(m),r=document.getElementById("profileVideo");r.src=o,r.poster=e,r.onloadeddata=p,r.onerror=()=>{console.error("Failed to load profile video"),p()}}catch(n){console.error("Error loading media from Firebase:",n),setTimeout(()=>{L.classList.add("hidden"),document.body.style.overflow="auto",S()},1e3)}}function S(){document.querySelectorAll('a[href^="#"]').forEach(o=>{o.addEventListener("click",function(r){r.preventDefault();const c=document.querySelector(this.getAttribute("href"));c&&c.scrollIntoView({behavior:"smooth",block:"start"})})});let n=0;const s=document.querySelector(".header");window.addEventListener("scroll",()=>{const o=window.pageYOffset||document.documentElement.scrollTop;o>n&&o>100?s.style.transform="translateY(-100%)":s.style.transform="translateY(0)",n=o});const a={threshold:.1,rootMargin:"0px 0px -50px 0px"},l=new IntersectionObserver(o=>{o.forEach(r=>{r.isIntersecting&&(r.target.style.opacity="1",r.target.style.transform="translateY(0)")})},a);document.querySelectorAll(".project-card, .skill-item, .award-category").forEach(o=>{o.style.opacity="0",o.style.transform="translateY(30px)",o.style.transition="opacity 0.6s ease, transform 0.6s ease",l.observe(o)}),document.querySelector(".video-container");const e=document.getElementById("profileVideo"),t=document.querySelector(".video-overlay");t&&e&&(t.addEventListener("click",()=>{e.paused?(e.play(),t.style.opacity="0"):(e.pause(),t.style.opacity="1")}),e.addEventListener("click",()=>{e.paused?(e.play(),t.style.opacity="0"):(e.pause(),t.style.opacity="1")}),e.addEventListener("ended",()=>{t.style.opacity="1"}));const i=document.querySelector(".nav-toggle"),f=document.querySelector(".nav-menu");i&&f&&(i.addEventListener("click",()=>{f.classList.toggle("active"),i.classList.toggle("active")}),document.querySelectorAll(".nav-menu a").forEach(o=>{o.addEventListener("click",()=>{f.classList.remove("active"),i.classList.remove("active")})}));const d=document.getElementById("contactForm");d&&d.addEventListener("submit",async o=>{o.preventDefault();const r=new FormData(d),c=r.get("name"),v=r.get("email"),b=r.get("subject"),w=r.get("message"),A=r.get("phone")||"";try{if((await fetch("https://molotov-backend.vercel.app/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:c,email:v,subject:b,description:w,phone:A,selectedDate:""})})).ok)I("Thank you for your message! I will get back to you soon.","success");else throw new Error("Failed to send message")}catch(x){console.error("Error sending message:",x),I("Sorry, there was an error sending your message. Please try again.","error")}d.reset()}),window.addEventListener("scroll",()=>{const o=window.pageYOffset;document.querySelectorAll(".floating-image").forEach((c,v)=>{const b=.5+v*.2,w=-(o*b);c.style.transform=`translateY(${w}px)`})}),document.querySelectorAll(".project-card").forEach(o=>{o.addEventListener("mouseenter",()=>{o.style.transform="translateY(-10px) scale(1.02)"}),o.addEventListener("mouseleave",()=>{o.style.transform="translateY(0) scale(1)"})});const m=document.querySelector(".title-main");if(m){const o=m.textContent;m.textContent="",m.style.borderRight="2px solid var(--muted-sepia)";let r=0;const c=()=>{r<o.length?(m.textContent+=o.charAt(r),r++,setTimeout(c,100)):setTimeout(()=>{m.style.borderRight="none"},1e3)};setTimeout(c,1e3)}}function I(n,s="info"){const a=document.createElement("div");a.className=`notification notification-${s}`,a.textContent=n,a.style.cssText=`
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
    `,document.body.appendChild(a),setTimeout(()=>{a.style.transform="translateX(0)"},100),setTimeout(()=>{a.style.transform="translateX(100%)",setTimeout(()=>{document.body.removeChild(a)},300)},3e3)}function k(){document.querySelectorAll("img").forEach(s=>{s.loading="lazy";const a=new IntersectionObserver(l=>{l.forEach(e=>{if(e.isIntersecting){const t=e.target;t.dataset.src&&(t.src=t.dataset.src,t.removeAttribute("data-src"),a.unobserve(t))}})});s.dataset.src&&a.observe(s)})}document.addEventListener("DOMContentLoaded",()=>{document.body.style.overflow="hidden",C(),k();const n=document.createElement("style");n.textContent=`
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
    `,document.head.appendChild(n)});window.addEventListener("error",n=>{console.error("JavaScript error:",n.error)});window.addEventListener("unhandledrejection",n=>{console.error("Unhandled promise rejection:",n.reason),n.preventDefault()});
//# sourceMappingURL=index-IzhSKog-.js.map
