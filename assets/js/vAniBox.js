(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
  
    const selector = '.vAniBox';
    const activeClass = 'gogo';
  
    const hero = document.querySelector(selector);
    if (!hero) return;
  
    hero.classList.remove(activeClass);
  
    // background-image url 추출 유틸
    function getBgUrl(el, pseudo) {
      const bg = getComputedStyle(el, pseudo).backgroundImage;
      if (!bg || bg === 'none') return null;
      const m = bg.match(/url\(["']?(.*?)["']?\)/);
      return m?.[1] || null;
    }
  
    // 우선순위: ::before → ::after → 본체
    const url =
      getBgUrl(hero, '::before') ||
      getBgUrl(hero, '::after') ||
      getBgUrl(hero, null);
  
    const restart = () => {
      hero.classList.remove(activeClass);
      void hero.offsetWidth; // reflow → 애니메이션 재시작 보장
      requestAnimationFrame(() => hero.classList.add(activeClass));
    };
  
    // 배경 못 잡아도 애니메이션은 실행
    if (!url) {
      requestAnimationFrame(restart);
      return;
    }
  
    const img = new Image();
    img.onload = restart;
    img.onerror = restart;
    img.src = url;
  
    // 캐시 대응
    if (img.complete) restart();
  })();
  