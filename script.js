gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('scrollyVideo');
const navbar = document.getElementById('mainNavbar');

// Evita que a animação seja inicializada mais de uma vez
// (antes o script rodava em DOMContentLoaded + loadedmetadata + loadeddata,
// criando várias ScrollTriggers duplicadas e deixando tudo "tremido")
let scrollytellingInitialized = false;

if (video) {
  video.muted = true;
  video.playsInline = true;
  video.pause();

  video.play().then(() => {
    video.pause();
  }).catch(() => {
    video.pause();
  });
}

function initScrollTrigger() {
  if (scrollytellingInitialized) return;
  scrollytellingInitialized = true;

  const duration = (video && !isNaN(video.duration) && video.duration > 0) ? video.duration : 10;

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scrollTrack",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.1,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (video && duration) {
          const targetTime = self.progress * duration;
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
          }
        }

        if (navbar) {
          if (self.progress > 0.05 && self.progress < 0.95) {
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

  // 2. MENSAGEM 1 (15% a 40%)
  tl.fromTo("#msg1", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12 }, 0.15);
  tl.to("#msg1", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.12 }, 0.35);

  // 3. MENSAGEM 2 (40% a 65%)
  tl.fromTo("#msg2", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12 }, 0.40);
  tl.to("#msg2", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.12 }, 0.60);

  // 4. MENSAGEM 3 (65% a 90%)
  tl.fromTo("#msg3", { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12 }, 0.65);
  tl.to("#msg3", { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.12 }, 0.88);

  // (Removido: fade de opacidade do .sticky-viewport aos 90%-100%.
  // Ele deixava a tela em preto "vazio" ainda PINADA, antes da próxima
  // seção aparecer, criando um espaço grande sem nada depois do vídeo.
  // Agora o próprio unpin do ScrollTrigger revela a seção seguinte
  // naturalmente, sem esse buraco.)

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

// Se o vídeo não existir ou falhar ao carregar, inicializa mesmo assim
// (com duração padrão de 10s) para as seções não ficarem travadas
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