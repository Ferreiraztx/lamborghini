gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('scrollyVideo');
const navbar = document.getElementById('mainNavbar');
let initialized = false;

if (video) {
  video.muted = true;
  video.playsInline = true;
}

function initScrollTrigger() {
  if (initialized) return; // Evita rodar duas vezes
  initialized = true;

  const duration = (video && !isNaN(video.duration) && video.duration > 0) ? video.duration : 10;

  // Timeline principal do Scroll
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scrollTrack",
      start: "top top",
      end: "bottom top",
      scrub: 0.3,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Atualiza vídeo se estiver rodando no desktop
        if (video && duration && video.readyState >= 1) {
          const targetTime = self.progress * duration;
          if (Math.abs(video.currentTime - targetTime) > 0.02) {
            video.currentTime = targetTime;
          }
        }

        // Esconde/mostra Navbar
        if (self.progress > 0.05 && self.progress < 0.90) {
          navbar.classList.add('hidden');
        } else {
          navbar.classList.remove('hidden');
        }
      }
    }
  });

  // 1. HERO INITIAL (0% a 15%)
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

  // 5. SUMIR VÍDEO NO FINAL DA ROLAGEM
  tl.to(".sticky-viewport", {
    opacity: 0,
    duration: 0.25
  }, 0.75);

  // SEÇÕES INFERIORES
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

// INICIALIZAÇÃO GARANTIDA:
// Tenta rodar nos eventos de mídia, mas se demorar mais de 300ms, força a montagem do site
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initScrollTrigger, 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initScrollTrigger, 100));
}

if (video) {
  video.addEventListener('loadeddata', initScrollTrigger);
  video.addEventListener('loadedmetadata', initScrollTrigger);
}