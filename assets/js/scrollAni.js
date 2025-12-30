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
          obs.unobserve(el);
        }
      } else {
        if (isRepeat) el.classList.remove(activeClass);
      }
    }
  }, {
    threshold: 0,
    rootMargin: '10% 0px 10% 0px'
  });

  function observeAll() {
    document.querySelectorAll(selector).forEach(el => {
      if (el.classList.contains(activeClass) && !el.classList.contains(repeatClass)) return;
      io.observe(el);
    });
  }

  // ✅ “이미지 때문에 늦게 레이아웃 잡히는” 케이스 대응:
  // 1) DOM 준비
  // 2) window load(이미지/리소스 로드 후)
  // 3) 개별 이미지 load 시에도 한번 더(늦게 뜨는 애들)
  function refreshAfterImages() {
    const imgs = Array.from(document.images || []);
    if (!imgs.length) return;

    let pending = 0;
    imgs.forEach(img => {
      if (img.complete) return;
      pending++;
      img.addEventListener('load', () => {
        // 레이아웃 반영 다음 프레임에 재관측
        requestAnimationFrame(observeAll);
      }, { once: true });
      img.addEventListener('error', () => {
        requestAnimationFrame(observeAll);
      }, { once: true });
    });

    // 혹시 늦게 끝나는 경우 대비(안전장치)
    if (pending) {
      window.addEventListener('load', () => {
        requestAnimationFrame(observeAll);
      }, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observeAll();
      refreshAfterImages();
    });
  } else {
    observeAll();
    refreshAfterImages();
  }

  // 외부에서 수동 갱신 가능
  window.aniBoxRefresh = observeAll;
})();
