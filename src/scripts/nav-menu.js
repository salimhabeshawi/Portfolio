function initNavMenu() {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (!navToggle || !mainNav) return;

  const siteHeader = navToggle.closest(".site-header");
  const MOBILE_MAX = 768;

  function isOpen() {
    return mainNav.classList.contains("is-open");
  }

  function openMenu() {
    mainNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMenu() {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }

  navToggle.addEventListener("click", function () {
    isOpen() ? closeMenu() : openMenu();
  });

  // Close when any nav link is clicked (handles same-page anchor links too)
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close on click outside the header
  document.addEventListener("click", function (e) {
    if (isOpen() && siteHeader && !siteHeader.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      closeMenu();
      navToggle.focus();
    }
  });

  // Close the menu whenever the page is scrolled (header will hide on scroll-down)
  window.addEventListener("scroll", function () {
    if (isOpen()) closeMenu();
  }, { passive: true });

  // Clear open state when resizing beyond mobile breakpoint
  window.addEventListener("resize", function () {
    if (window.innerWidth > MOBILE_MAX && isOpen()) {
      closeMenu();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavMenu, { once: true });
} else {
  initNavMenu();
}
