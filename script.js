gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('scrollyVideo');
const canvas = document.getElementById('videoCanvas');
const context = canvas ? canvas.getContext('2d') : null;
const navbar = document.getElementById('mainNavbar');

// Identifica se é celular/dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 868;

let scrollytellingInitialized = false;

// Declaração global da função renderFrame para evitar erros de referência
function renderFrame() {
  if (video && context && canvas && video.readyState >= 2) {
    const hRatio = canvas.width / video.videoWidth;
    const vRatio = canvas.height / video.videoHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - video.videoWidth * ratio) / 2;
    const centerShift_y = (canvas.height - video.videoHeight * ratio) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      video,
      0, 0, video.videoWidth, video.videoHeight,
      centerShift_x, centerShift_y, video.videoWidth * ratio, video.videoHeight * ratio
    );
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame();
  }
}

// Configuração exclusiva para Celular (Canvas)
if (isMobile && canvas && video) {
  canvas.style.display = 'block';
  video.style.display = 'none';

  window.addEventListener('resize', resizeCanvas);
  video.addEventListener('seeked', renderFrame);
  video.addEventListener('loadeddata', resizeCanvas);

  // Desbloqueia reprodução no toque
  const unlockMobile = () => {
    video.play().then(() => {
      video.pause();
      renderFrame();
    }).catch(() => {});
    window.removeEventListener('touchstart', unlockMobile);
  };
  window.addEventListener('touchstart', unlockMobile, { once: true });
}

function initScrollTrigger() {
  if (scrollytellingInitialized) return;
  scrollytellingInitialized = true;

  if (isMobile && canvas) {
    resizeCanvas();
  }

  const duration = (video && !isNaN(video.duration) && video.duration > 0) ? video.duration : 10;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scrollTrack",
      start: "top top",
      end: "+=200%",
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (video && duration) {
          const targetTime = self.progress * duration;
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
            if (isMobile) {
              renderFrame();
            }
          }
        }

        if (navbar) {
          if (self.progress > 0.05 && self.progress < 0.92) {
            navbar.classList.add('hidden');
          } else {
            navbar.classList.remove('hidden');
          }
        }
      }
    }
  });

  // 1. HERO INITIAL (0% a 15%)
  tl.to("#heroInterface", { opacity: 0, y: -40, filter: "blur(10px)", duration: 0.15 }, 0);

  // 2. MENSAGEM 1 (15% a 38%)
  tl.fromTo("#msg1", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.10 }, 0.15);
  tl.to("#msg1", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.10 }, 0.28);

  // 3. MENSAGEM 2 (38% a 60%)
  tl.fromTo("#msg2", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.10 }, 0.38);
  tl.to("#msg2", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.10 }, 0.50);

  // 4. MENSAGEM 3 (60% a 80%)
  tl.fromTo("#msg3", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.10 }, 0.60);
  tl.to("#msg3", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.10 }, 0.72);

  // 5. FADE OUT DO VÍDEO NO FINAL (82% a 96%)
  // Esmaece a viewport suavemente enquanto a próxima seção sobe
  tl.to(".sticky-viewport", { opacity: 0, duration: 0.14 }, 0.82);

  // CONTADORES NUMÉRICOS
  gsap.utils.toArray('.card-number').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;

    gsap.to(counter, {
      scrollTrigger: { trigger: counter, start: "top 90%", once: true },
      innerText: target,
      duration: 2,
      ease: "power2.out",
      snap: { innerText: decimals === 0 ? 1 : 0.1 },
      onUpdate: function () {
        counter.innerText = parseFloat(this.targets()[0].innerText).toFixed(decimals);
      }
    });
  });

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
}

function fallbackInit() {
  setTimeout(initScrollTrigger, 300);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  fallbackInit();
} else {
  document.addEventListener('DOMContentLoaded', fallbackInit);
}

if (video) {
  video.addEventListener('loadedmetadata', initScrollTrigger);
  video.addEventListener('error', initScrollTrigger);
}