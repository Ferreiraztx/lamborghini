gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('scrollyVideo');
const navbar = document.getElementById('mainNavbar');

if (video) {
  video.muted = true;
  video.pause();
}

function initScrollTrigger() {
  const duration = (video && !isNaN(video.duration) && video.duration > 0) ? video.duration : 10;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scrollTrack",
      start: "top top",
      end: "bottom top",
      scrub: 0.3,
      pin: true,
      pinSpacing: false, // Evita que o GSAP crie o bloco/espaço preto de preenchimento
      anticipatePin: 1,
      onUpdate: (self) => {
        if (video && duration) {
          const targetTime = self.progress * duration;
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        }

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

  // 5. TRANSITION OUT (75% a 100%): Esmaeceu o vídeo e a viewport para sumir a imagem congelada
  tl.to(".sticky-viewport", {
    opacity: 0,
    duration: 0.25
  }, 0.75);

  // ANIMAÇÃO DAS SEÇÕES INFERIORES
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

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);
}

if (video) {
  if (video.readyState >= 2) {
    initScrollTrigger();
  } else {
    video.addEventListener('loadeddata', initScrollTrigger);
    setTimeout(initScrollTrigger, 600);
  }
}