function initSiteScrollbar() {
  const siteScrollbar = document.querySelector(".site-scrollbar");
  const siteScrollbarThumb = document.querySelector(".site-scrollbar-thumb");

  if (!siteScrollbar || !siteScrollbarThumb) return;

  let isDraggingSiteThumb = false;
  let siteThumbDragOffsetY = 0;
  let siteScrollRafId = null;
  let activeDragMetrics = null;
  let activeRailTop = 0;
  let hideSiteScrollbarTimeout;
  const siteScrollbarIdleMs = 1200;

  function isPageScrollable(metrics) {
    return (
      metrics.totalHeight > metrics.visibleHeight + 1 && metrics.railHeight > 0
    );
  }

  function showSiteScrollbar() {
    const metrics = getPageScrollMetrics();
    if (!isPageScrollable(metrics)) {
      siteScrollbar.classList.add("is-hidden");
      return;
    }

    siteScrollbar.classList.remove("is-hidden");
  }

  function scheduleHideSiteScrollbar() {
    clearTimeout(hideSiteScrollbarTimeout);

    hideSiteScrollbarTimeout = setTimeout(function () {
      if (!isDraggingSiteThumb) {
        siteScrollbar.classList.add("is-hidden");
      }
    }, siteScrollbarIdleMs);
  }

  function getPageScrollMetrics() {
    const scrollElement = document.documentElement;
    const visibleHeight = window.innerHeight;
    const totalHeight = scrollElement.scrollHeight;
    const railHeight = siteScrollbar.clientHeight;
    const minThumbHeight = 34;
    const calculatedThumbHeight = Math.round(
      (visibleHeight / totalHeight) * railHeight,
    );
    const thumbHeight = Math.min(
      railHeight,
      Math.max(minThumbHeight, calculatedThumbHeight),
    );
    const maxScrollTop = Math.max(0, totalHeight - visibleHeight);
    const maxThumbTop = Math.max(0, railHeight - thumbHeight);

    return {
      totalHeight,
      visibleHeight,
      railHeight,
      thumbHeight,
      maxScrollTop,
      maxThumbTop,
    };
  }

  function syncSiteScrollbar() {
    const metrics = getPageScrollMetrics();

    if (!isPageScrollable(metrics)) {
      siteScrollbar.classList.add("is-hidden");
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const progress =
      metrics.maxScrollTop > 0 ? scrollTop / metrics.maxScrollTop : 0;
    const thumbTop = metrics.maxThumbTop * progress;

    siteScrollbarThumb.style.height = `${metrics.thumbHeight}px`;
    siteScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
  }

  function scheduleSiteScrollbarSync() {
    if (siteScrollRafId !== null) return;

    siteScrollRafId = window.requestAnimationFrame(function () {
      siteScrollRafId = null;
      syncSiteScrollbar();
    });
  }

  function setPageScrollFromThumbTop(thumbTop, metrics) {
    const scrollElement = document.documentElement;

    if (!metrics.maxThumbTop || !metrics.maxScrollTop) {
      scrollElement.scrollTop = 0;
      return;
    }

    const progress = thumbTop / metrics.maxThumbTop;
    scrollElement.scrollTop = progress * metrics.maxScrollTop;
  }

  function renderThumbAt(thumbTop, thumbHeight) {
    siteScrollbarThumb.style.height = `${thumbHeight}px`;
    siteScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
  }

  function handleRailPointerDown(event) {
    if (event.target === siteScrollbarThumb) return;

    const metrics = getPageScrollMetrics();
    if (metrics.maxThumbTop <= 0) return;

    const railRect = siteScrollbar.getBoundingClientRect();
    const rawThumbTop = event.clientY - railRect.top - metrics.thumbHeight / 2;
    const thumbTop = Math.max(0, Math.min(rawThumbTop, metrics.maxThumbTop));

    showSiteScrollbar();
    setPageScrollFromThumbTop(thumbTop, metrics);
    scheduleSiteScrollbarSync();
    scheduleHideSiteScrollbar();
  }

  function handleThumbPointerDown(event) {
    event.preventDefault();

    const thumbRect = siteScrollbarThumb.getBoundingClientRect();
    siteThumbDragOffsetY = event.clientY - thumbRect.top;
    isDraggingSiteThumb = true;
    activeDragMetrics = getPageScrollMetrics();
    activeRailTop = siteScrollbar.getBoundingClientRect().top;

    siteScrollbarThumb.classList.add("is-dragging");
    document.documentElement.classList.add("is-dragging-site-scrollbar");
    document.body.classList.add("is-dragging-site-scrollbar");
    showSiteScrollbar();
    siteScrollbarThumb.setPointerCapture(event.pointerId);
  }

  function handleThumbPointerMove(event) {
    if (!isDraggingSiteThumb) return;

    const metrics = activeDragMetrics || getPageScrollMetrics();
    if (metrics.maxThumbTop <= 0) return;

    const rawThumbTop = event.clientY - activeRailTop - siteThumbDragOffsetY;
    const thumbTop = Math.max(0, Math.min(rawThumbTop, metrics.maxThumbTop));

    renderThumbAt(thumbTop, metrics.thumbHeight);
    setPageScrollFromThumbTop(thumbTop, metrics);

    if (!siteScrollRafId) {
      scheduleSiteScrollbarSync();
    }

    showSiteScrollbar();
  }

  function stopThumbDragging(event) {
    isDraggingSiteThumb = false;
    activeDragMetrics = null;
    siteScrollbarThumb.classList.remove("is-dragging");
    document.documentElement.classList.remove("is-dragging-site-scrollbar");
    document.body.classList.remove("is-dragging-site-scrollbar");
    scheduleHideSiteScrollbar();

    if (
      event &&
      typeof event.pointerId === "number" &&
      siteScrollbarThumb.hasPointerCapture(event.pointerId)
    ) {
      siteScrollbarThumb.releasePointerCapture(event.pointerId);
    }
  }

  function handleWindowScroll() {
    showSiteScrollbar();
    scheduleSiteScrollbarSync();
    scheduleHideSiteScrollbar();
  }

  function handleWindowResize() {
    scheduleSiteScrollbarSync();
    scheduleHideSiteScrollbar();
  }

  window.addEventListener("scroll", handleWindowScroll, { passive: true });
  window.addEventListener("resize", handleWindowResize);

  siteScrollbar.addEventListener("pointerdown", handleRailPointerDown);
  siteScrollbarThumb.addEventListener("pointerdown", handleThumbPointerDown);
  siteScrollbarThumb.addEventListener("pointermove", handleThumbPointerMove);
  siteScrollbarThumb.addEventListener("pointerup", stopThumbDragging);
  siteScrollbarThumb.addEventListener("pointercancel", stopThumbDragging);

  window.requestAnimationFrame(function () {
    syncSiteScrollbar();
    scheduleHideSiteScrollbar();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteScrollbar, {
    once: true,
  });
} else {
  initSiteScrollbar();
}
