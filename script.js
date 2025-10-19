// ==== LOGIN & REGISTER ====
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");
  const formTitle = document.getElementById("form-title");

  if (showRegister && showLogin) {
    // Toggle Login/Register
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      formTitle.textContent = "Register";
    });

    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.style.display = "none";
      loginForm.style.display = "block";
      formTitle.textContent = "Login";
    });
  }

  // Register
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (localStorage.getItem(username)) {
        alert("Username sudah terdaftar!");
      } else {
        localStorage.setItem(username, password);
        alert("Registrasi berhasil! Silakan login.");
        registerForm.reset();
        showLogin.click();
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      const storedPassword = localStorage.getItem(username);
      if (storedPassword && storedPassword === password) {
        alert("Login berhasil!");
        localStorage.setItem("loggedInUser", username);
  window.location.href = "home.html";
      } else {
        alert("Username atau password salah!");
      }
    });
  }

  // ==== PROTEKSI HALAMAN (anti akses tanpa login) ====
  if (
    !window.location.href.includes("index.html") &&
    !localStorage.getItem("loggedInUser")
  ) {
    window.location.href = "index.html";
  }

  // Initialize nav user display and toggle login/logout buttons
  const navUser = document.getElementById('navUser');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtnEl = document.getElementById('logoutBtn');
  const currentUser = localStorage.getItem('loggedInUser');
  function initials(name){
    if(!name) return 'G';
    const parts = name.split(/\s+/).filter(Boolean);
    if(parts.length === 1) return parts[0].slice(0,1).toUpperCase();
    return (parts[0].slice(0,1) + parts[parts.length-1].slice(0,1)).toUpperCase();
  }
  if (navUser) {
    if (currentUser) {
      const init = initials(currentUser);
      navUser.innerHTML = `<span class="nav-avatar">${init}</span><span class="nav-username">${currentUser}</span>`;
    } else {
      navUser.innerHTML = `<span class="nav-avatar">G</span><span class="nav-username">Guest</span>`;
    }
  }
  if (currentUser) {
    if (logoutBtnEl) logoutBtnEl.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    if (logoutBtnEl) logoutBtnEl.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
  }
  if (logoutBtnEl) {
    logoutBtnEl.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      // optional: update UI immediately
      if (navUser) navUser.textContent = 'Guest';
      if (logoutBtnEl) logoutBtnEl.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      window.location.href = 'index.html';
    });
  }

  // Account dropdown behavior
  const navUserBtn = document.getElementById('navUserBtn');
  const accountDropdown = document.getElementById('accountDropdown');
  function closeDropdown(){ if(accountDropdown){ accountDropdown.classList.remove('show'); navUserBtn && navUserBtn.setAttribute('aria-expanded','false'); accountDropdown.setAttribute('aria-hidden','true'); } }
  function openDropdown(){ if(accountDropdown){ accountDropdown.classList.add('show'); navUserBtn && navUserBtn.setAttribute('aria-expanded','true'); accountDropdown.setAttribute('aria-hidden','false'); } }
  if(navUserBtn){
    navUserBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      if(accountDropdown.classList.contains('show')) closeDropdown(); else openDropdown();
    });
  }
  // close when clicking outside
  document.addEventListener('click', (e)=>{ if(accountDropdown && !accountDropdown.contains(e.target) && !navUserBtn.contains(e.target)) closeDropdown(); });

  // ==== LOGOUT ====
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("Anda telah logout.");
      window.location.href = "index.html";
    });
  }

  // ==== SCROLL TOP BUTTON ====
  const toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", () => {
      toTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==== CAROUSEL (simple) ====
  const slides = document.querySelectorAll(".carousel-item");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  if (slides.length > 0) {
    // initialize
    showSlide(currentSlide);
    let carouselInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
      updateDots();
    }, 4000);

    // Build dots
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = [];
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.addEventListener('click', () => {
          currentSlide = i; showSlide(i); updateDots();
        });
        dotsContainer.appendChild(btn);
        dots.push(btn);
      });
    }

    function updateDots(){
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }
    updateDots();

    // Prev/Next controls
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    if (prevBtn) prevBtn.addEventListener('click', () => { currentSlide = (currentSlide-1+slides.length)%slides.length; showSlide(currentSlide); updateDots(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentSlide = (currentSlide+1)%slides.length; showSlide(currentSlide); updateDots(); });

    // Pause on hover
    const carouselEl = document.querySelector('.carousel');
    if (carouselEl) {
      // keyboard navigation when carousel is focused
      carouselEl.setAttribute('tabindex', '0');
      carouselEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { currentSlide = (currentSlide-1+slides.length)%slides.length; showSlide(currentSlide); updateDots(); }
        if (e.key === 'ArrowRight') { currentSlide = (currentSlide+1)%slides.length; showSlide(currentSlide); updateDots(); }
      });
      carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselEl.addEventListener('mouseleave', () => { carouselInterval = setInterval(() => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); updateDots(); }, 4000); });

      // subtle parallax on mouse move
      carouselEl.addEventListener('mousemove', (e) => {
        const rect = carouselEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        slides.forEach((slide,i)=>{
          const img = slide.querySelector('img');
          if(img) img.style.transform = `translate(${x*6}px, ${y*4}px) scale(${i===currentSlide?1.03:1})`;
        });
      });
      carouselEl.addEventListener('mouseleave', () => { slides.forEach(s=>{ const img = s.querySelector('img'); if(img) img.style.transform = ''; }); });
    }
  }

  // ==== REVEAL ON SCROLL (IntersectionObserver) ====
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // fallback: just activate all
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Activate auth container animation if present
  const authContainer = document.querySelector('.auth-container');
  if (authContainer) {
    setTimeout(() => authContainer.classList.add('active'), 80);
  }

  // Ripple click position for .ripple
  document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--ripple-x', x + 'px');
      this.style.setProperty('--ripple-y', y + 'px');
    });
  });
});

// ===== Global helpers (available before DOMContentLoaded if needed) =====
function toggleMenu(){ const nav = document.querySelector('.nav-menu'); if(nav) nav.classList.toggle('active'); }
function openModal(){ const modal = document.getElementById('authModal'); if(modal) modal.classList.add('show'); }
function closeModal(){ const modal = document.getElementById('authModal'); if(modal) modal.classList.remove('show'); }
function scrollToTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if(!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
});

// Dynamically load AOS script then init AOS
(function loadAOS(){
  if (window.AOS) { AOS.init({ duration: 900, once: true, offset: 100 }); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
  s.async = true;
  s.onload = () => { if (window.AOS) AOS.init({ duration: 900, once: true, offset: 100 }); };
  document.head.appendChild(s);
})();
