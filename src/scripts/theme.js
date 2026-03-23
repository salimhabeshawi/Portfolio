function initTheme() {
  const root = document.documentElement;
  const themeToggleButton = document.getElementById("themeToggle");
  const sunIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2.5"></path><path d="M12 19v2.5"></path><path d="M4.22 4.22l1.77 1.77"></path><path d="M18.01 18.01l1.77 1.77"></path><path d="M2.5 12h2.5"></path><path d="M19 12h2.5"></path><path d="M4.22 19.78l1.77-1.77"></path><path d="M18.01 5.99l1.77-1.77"></path></svg>';
  const moonIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.7 14.2a8.8 8.8 0 1 1-10.9-10.9 7.2 7.2 0 0 0 10.9 10.9z"></path></svg>';

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // noop
    }
  }

  function syncThemeToggleButton(theme) {
    if (!themeToggleButton) return;

    themeToggleButton.innerHTML = theme === "light" ? moonIcon : sunIcon;
    themeToggleButton.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode",
    );
    themeToggleButton.setAttribute("aria-pressed", String(theme === "light"));
  }

  function applyTheme(theme, shouldPersist) {
    root.setAttribute("data-theme", theme);
    syncThemeToggleButton(theme);

    if (shouldPersist) {
      persistTheme(theme);
    }
  }

  const theme = getSavedTheme() || "light";
  applyTheme(theme, false);

  if (!themeToggleButton) return;

  themeToggleButton.addEventListener("click", function () {
    const currentTheme = root.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme, true);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme, { once: true });
} else {
  initTheme();
}
