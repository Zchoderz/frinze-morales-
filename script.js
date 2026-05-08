// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 2.5,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(1 - t, 5)), // Quintic Out
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offset = window.innerWidth < 968 ? -20 : -50;
      lenis.scrollTo(targetElement, {
        offset: offset,
        duration: 1.5,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(1 - t, 5))
      });
    }
  });
});

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  cursorOutline.animate({
    left: `${posX}px`,
    top: `${posY}px`
  }, { duration: 500, fill: "forwards" });
});

// Preloader Logic
const loaderPercentElement = document.querySelector('.loader-percent');
const loaderBar = document.querySelector('.loader-bar');
const loaderStatus = document.querySelector('.loader-status');

const statusMessages = [
  "INITIALIZING CORE",
  "LOADING ASSETS",
  "OPTIMIZING LAYOUT",
  "FINALIZING BUILD",
  "READYING PORTFOLIO"
];

let loaderPercent = 0;

const updateLoader = () => {
  loaderPercent++;
  if (loaderPercent > 100) loaderPercent = 100;

  if (loaderPercentElement) loaderPercentElement.textContent = loaderPercent;
  if (loaderBar) loaderBar.style.width = loaderPercent + '%';

  // Cycle status messages
  if (loaderStatus) {
    const msgIndex = Math.min(Math.floor(loaderPercent / 20), statusMessages.length - 1);
    if (loaderStatus.textContent !== statusMessages[msgIndex]) {
      loaderStatus.textContent = statusMessages[msgIndex];
    }
  }

  if (loaderPercent < 100) {
    let delay = loaderPercent < 80 ? 20 : 40;
    setTimeout(updateLoader, delay);
  } else {
    setTimeout(revealPage, 600);
  }
};

const revealPage = () => {
  const tl = gsap.timeline();

  tl.to('.loader-content', {
    opacity: 0,
    y: -30,
    duration: 0.5,
    ease: "power2.in"
  })
    .to('.loader-tile', {
      scale: 0,
      opacity: 0,
      rotate: 45,
      duration: 0.8,
      stagger: {
        amount: 0.8,
        grid: [10, 10],
        from: "top-left"
      },
      ease: "power2.inOut"
    })
    .set('.loader', { pointerEvents: 'none' })
    .from('.hero-title .line', {
      yPercent: 120,
      opacity: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power4.out"
    }, "-=0.8")
    .from('.hero-top-info, .hero-bottom-row, .site-header', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=1");
};

// Word-by-Word Reveal on Scroll & Mouse Proximity
const revealText = () => {
  const textElements = document.querySelectorAll('.bento-item p');
  
    textElements.forEach((p) => {
      if (p.classList.contains('split-done')) return;
      
      const content = p.innerHTML.trim(); // Clean up leading/trailing spaces
      const parts = content.split('<br>');
      
      p.innerHTML = parts.map(part => {
        return part.trim().split(/\s+/).map(word => 
          `<span class="scroll-word">${word}</span>`
        ).join(' ');
      }).join('<br>');
      
      p.classList.add('split-done');
    
    const wordSpans = p.querySelectorAll('.scroll-word');
    
    // Scroll Trigger
    gsap.to(wordSpans, {
      color: 'rgba(255, 255, 255, 1)',
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: p,
        start: "top 85%",
        end: "top 15%",
        scrub: true,
      }
    });

    // Mouse Proximity Effect
    p.closest('.bento-item').addEventListener('mousemove', (e) => {
      wordSpans.forEach(word => {
        const rect = word.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - wordX, e.clientY - wordY);
        
        if (dist < 150) {
          const intensity = 1 - (dist / 150);
          word.style.color = `rgba(255, 255, 255, ${0.2 + (intensity * 0.8)})`;
          word.style.textShadow = `0 0 ${intensity * 10}px var(--accent)`;
        } else {
          word.style.textShadow = 'none';
        }
      });
    });

    p.closest('.bento-item').addEventListener('mouseleave', () => {
      wordSpans.forEach(word => {
        word.style.textShadow = 'none';
      });
    });
  });
};

// Generate Loader Tiles
const createTiles = () => {
  const container = document.querySelector('.loader-tiles-container');
  if (container) {
    for (let i = 0; i < 100; i++) {
      const tile = document.createElement('div');
      tile.classList.add('loader-tile');
      container.appendChild(tile);
    }
  }
};

createTiles();
revealText();

// Initial state for animations
gsap.set('.hero-title .line', { yPercent: 100 });

window.onload = () => {
  // Reset loader to 0
  if (loaderPercentElement) loaderPercentElement.textContent = '0';
  if (loaderBar) loaderBar.style.width = '0%';
  
  // Start the count
  loaderPercent = 0;
  updateLoader();
};

// Year update & Local Time
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const updateLocalTime = () => {
  const timeDisplay = document.getElementById('local-time');
  if (timeDisplay) {
    const options = {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
    timeDisplay.textContent = `${timeString} PHT`;
  }
};

setInterval(updateLocalTime, 1000);
updateLocalTime();

// Video Modal Logic
const videoModal = document.querySelector('.video-modal');
const modalVideo = document.querySelector('.modal-video-player');
const openModalBtns = document.querySelectorAll('.btn-play-video, .project-video');
const closeModalBtn = document.querySelector('.video-modal-close');
const modalOverlay = document.querySelector('.video-modal-overlay');

if (videoModal && modalVideo) {
  const openModal = () => {
    videoModal.style.display = 'flex';
    gsap.to(videoModal, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    modalVideo.play();
    lenis.stop(); // Stop scroll when modal is open
  };

  const closeModal = () => {
    gsap.to(videoModal, { 
      opacity: 0, 
      duration: 0.4, 
      ease: 'power2.in', 
      onComplete: () => {
        videoModal.style.display = 'none';
        modalVideo.pause();
        modalVideo.currentTime = 0;
        lenis.start(); // Resume scroll
      }
    });
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.style.display === 'flex') {
      closeModal();
    }
  });
}

// Photo Gallery Logic
const photoModal = document.querySelector('.photo-modal');
const openGalleryBtn = document.querySelector('.open-gallery');
const closePhotoBtn = document.querySelector('.photo-modal-close');
const photoOverlay = document.querySelector('.photo-modal-overlay');
const sliderImgs = document.querySelectorAll('.slider-img');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
const counter = document.querySelector('.slider-counter');

let currentIdx = 0;

if (photoModal) {
  const updateSlider = () => {
    sliderImgs.forEach((img, i) => {
      img.classList.toggle('active', i === currentIdx);
    });
    counter.innerText = `${currentIdx + 1} / ${sliderImgs.length}`;
  };

  const openGallery = () => {
    photoModal.style.display = 'flex';
    gsap.to(photoModal, { opacity: 1, duration: 0.5 });
    lenis.stop();
  };

  const closeGallery = () => {
    gsap.to(photoModal, { 
      opacity: 0, 
      duration: 0.4, 
      onComplete: () => {
        photoModal.style.display = 'none';
        lenis.start();
      }
    });
  };

  openGalleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openGallery();
  });

  closePhotoBtn.addEventListener('click', closeGallery);
  photoOverlay.addEventListener('click', closeGallery);

  nextBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % sliderImgs.length;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + sliderImgs.length) % sliderImgs.length;
    updateSlider();
  });
}

// Enhanced Global Proximity Magnetic Effect (Desktop Only)
const initMagnetic = () => {
  if (window.innerWidth < 968) return;

  const magneticElements = document.querySelectorAll('.magnetic-wrap');
  
  // Remove CSS transitions that might conflict with GSAP
  magneticElements.forEach(el => {
    const item = el.querySelector('.magnetic-item') || el;
    item.style.transition = 'none';
  });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    magneticElements.forEach(element => {
      const item = element.querySelector('.magnetic-item') || element;
      const rect = element.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      
      const isTitle = element.classList.contains('hero-title-wrapper');
      const threshold = isTitle ? 1000 : 400; 
      const strength = isTitle ? 0.4 : 0.6; // Balanced pull for the title
      
      if (distance < threshold) {
        const power = (threshold - distance) / threshold;
        const xMove = dx * strength * power; 
        const yMove = dy * strength * power;
        
        gsap.to(item, {
          x: xMove,
          y: yMove,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.3)",
          overwrite: true
        });
      }
    });
  };

  window.removeEventListener('mousemove', handleMouseMove); // Clean up just in case
  window.addEventListener('mousemove', handleMouseMove);
};

// Initialize after preloader or immediately
if (document.readyState === 'complete') {
  initMagnetic();
} else {
  window.addEventListener('load', initMagnetic);
}

