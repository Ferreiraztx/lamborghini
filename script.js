gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('scrollyVideo');
const navbar = document.getElementById('mainNavbar');

let initialized = false;

// Detecção precisa de mobile/touch ou tela reduzida
const isMobile = window.innerWidth <= 868 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (video) {
  video.muted = true;
  video.playsInline = true;

  if (isMobile) {
    // Modo Mobile: Vídeo roda em loop continuo sem engasgar
    video.loop = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Trata autoplay bloqueado se necessário
      });
    }
  } else {
    // Modo PC: Pausa o vídeo para controle do tempo por scroll
    video.pause();
  }
}

function initScrollTrigger() {
  if (initialized) return;
  initialized = true;

  const duration = (video && !isNaN(video.duration) && video.duration > 0) ? video.duration : 10;

  // Timeline principal do Hero
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scrollTrack",
      start: "top top",
      end: "bottom top",
      scrub: 0.3,
      pin: true,
      pinSpacing: false, // Previne lacunas e blocos pretos na transição
      anticipatePin: 1,
      onUpdate: (self) => {
        // Atualiza a posição do tempo do vídeo apenas no PC
        if (!isMobile && video && duration && video.readyState >= 1) {
          const targetTime = self.progress * duration;
          if (Math.abs(video.currentTime - targetTime) > 0.02) {
            video.currentTime = targetTime;
          }
        }

        // Alterna exibição da Navbar
        if (self.progress > 0.05 && self.progress < 0.90) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
      }
    }
  });

  // 1. SUMIR HERO INICIAL (0% a 15%)
  tl.to("#heroInterface", {
    opacity: 0,
    y: -40,
    filter: "blur(10px)",
    duration: 0.15
  }, 0);

  // 2. MENSAGEM 1 (15% a 35%)
  tl.fromTo("#msg1",
    { opacity: 0, y: 30, filter: "blur(10px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.1 },
    0.15
  );
  tl.to("#msg1",
    { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.1 },
    0.30
  );

  // 3. MENSAGEM 2 (35% a 55%)
  tl.fromTo("#msg2",
    { opacity: 0, y: 30, filter: "blur(10px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.1 },
    0.35
  );
  tl.to("#msg2",
    { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.1 },
    0.50
  );

  // 4. MENSAGEM 3 (55% a 75%)
  tl.fromTo("#msg3",
    { opacity: 0, y: 30, filter: "blur(10px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.1 },
    0.55
  );
  tl.to("#msg3",
    { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.1 },
    0.70
  );

  // 5. TRANSITION OUT DO CONTAINER DO VÍDEO (75% a 100%)
  tl.to(".sticky-viewport", {
    opacity: 0,
    duration: 0.25
  }, 0.75);

  // ANIMAÇÃO DE ENTRADA DAS SEÇÕES INFERIORES
  gsap.utils.toArray('.normal-section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out"
    });
  });

  // CONTADORES NUMÉRICOS
  gsap.utils.toArray('.card-number').forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;

    gsap.to(counter, {
      scrollTrigger: {
        trigger: counter,
        start: "top 85%",
        once: true
      },
      innerText: target,
      duration: 2,
      ease: "power2.out",
      snap: { innerText: decimals === 0 ? 1 : 0.1 },
      onUpdate: function () {
        counter.innerText = parseFloat(this.targets()[0].innerText).toFixed(decimals);
      }
    });
  });

  ScrollTrigger.refresh();
}

// Inicialização imediata / resiliente
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initScrollTrigger, 50);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initScrollTrigger, 50));
}

if (video) {
  video.addEventListener('loadeddata', initScrollTrigger);
  video.addEventListener('loadedmetadata', initScrollTrigger);
}