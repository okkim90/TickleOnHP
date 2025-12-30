document.addEventListener('DOMContentLoaded', () => {

    const btn = document.querySelector('.btn_nav_toggle');
    const nav = document.querySelector('#nav');
    const body = document.body;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        btn.classList.toggle('is-open', isOpen);

        btn.setAttribute('aria-expanded', isOpen);
        btn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');

        body.style.overflow = isOpen ? 'hidden' : '';
    });

});



function lockScroll() {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
  
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  
    // ✅ header도 같이 보정
    const header = document.querySelector('.header');
    if (header) header.style.paddingRight = `${scrollBarWidth}px`;
}
  
function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // ✅ header 원복
    const header = document.querySelector('.header');
    if (header) header.style.paddingRight = '';
}
  