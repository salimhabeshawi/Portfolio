function initNavScroll() {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) return;

  const SCROLL_THRESHOLD = 8; // px — ignore tiny jitter

  let lastScrollY = window.scrollY;

  function updateNavVisibility() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (Math.abs(delta) < SCROLL_THRESHOLD) return;

    // Always show when near the very top of the page
    if (currentScrollY <= siteHeader.offsetHeight) {
      siteHeader.classList.remove("is-nav-hidden");
    } else if (delta > 0) {
      // Scrolling down — hide
      siteHeader.classList.add("is-nav-hidden");
    } else {
      // Scrolling up — reveal
      siteHeader.classList.remove("is-nav-hidden");
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", updateNavVisibility, { passive: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavScroll, { once: true });
} else {
  initNavScroll();
}
