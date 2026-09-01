const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
const progress = document.querySelector('.scroll-progress');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

function updateProgress() {
  if (!progress) return;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('visible'));

const counter = document.querySelector('[data-count]');
if (counter && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = Number(counter.dataset.count);
      const start = performance.now();
      const duration = 900;
      const animate = now => {
        const progressValue = Math.min((now - start) / duration, 1);
        counter.textContent = Math.floor(progressValue * target);
        if (progressValue < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.8 });
  counterObserver.observe(counter);
}

document.addEventListener('click', event => {
  if (!nav || !menuBtn || !nav.classList.contains('open')) return;
  if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});
