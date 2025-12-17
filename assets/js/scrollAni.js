(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selector = '.aniBox';
  const repeatClass = 'ani-repeat';
  const activeClass = 'gogo';
  const COOLDOWN_MS = 800;

  if (reduceMotion) {
    document.querySelectorAll(selector).forEach(el => el.classList.add(activeClass));
    return;
  }

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      const el = entry.target;
      const isRepeat = el.classList.contains(repeatClass);

      // ✅ 빠른 스크롤에서 isIntersecting만 믿지 말고 ratio도 같이 봄
      const inView = entry.isIntersecting || entry.intersectionRatio > 0;

      if (inView) {
        if (isRepeat) {
          const last = Number(el.dataset.aniLast || 0);
          const t = now();

          if (t - last < COOLDOWN_MS) continue;

          el.dataset.aniLast = String(t);
          el.classList.add(activeClass);
        } else {
          el.classList.add(activeClass);
          obs.unobserve(el); // 기본은 1회
        }
      } else {
        if (isRepeat) el.classList.remove(activeClass);
      }
    }
  }, {
    threshold: 0,                 // ✅ 조금만 보여도 트리거
    rootMargin: '10% 0px 10% 0px' // ✅ 살짝 미리/여유 있게 잡기
  });

  function observeAll() {
    document.querySelectorAll(selector).forEach(el => {
      if (el.classList.contains(activeClass) && !el.classList.contains(repeatClass)) return;
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAll);
  } else {
    observeAll();
  }

  window.aniBoxRefresh = observeAll;
})();