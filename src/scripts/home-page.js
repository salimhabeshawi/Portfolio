function initHomePage() {
  const scrollTopAid = document.getElementById("scrollTopAid");
  const scrollBottomAid = document.getElementById("scrollBottomAid");
  const scrollAidIdleMs = 1200;
  let hideScrollAidsTimeout;
  let lastScrollY = window.scrollY;
  const projectFilterTagButtons = Array.from(
    document.querySelectorAll(".project-filter-tag"),
  );
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const selectedProjectTags = new Set();
  const blogFilterTagButtons = Array.from(
    document.querySelectorAll(".blog-filter-tag"),
  );
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));
  const selectedBlogTags = new Set();
  const timelineList = document.querySelector(".timeline-list");
  const timelineScrollbar = document.querySelector(".timeline-scrollbar");
  const timelineScrollbarThumb = document.querySelector(
    ".timeline-scrollbar-thumb",
  );
  let isDraggingTimelineThumb = false;
  let timelineThumbDragOffsetY = 0;

  function showLatestTimelineEntry() {
    if (!timelineList) return;

    timelineList.scrollTop = timelineList.scrollHeight;
  }

  function getTimelineScrollMetrics() {
    if (!timelineList || !timelineScrollbar) return null;

    const visibleHeight = timelineList.clientHeight;
    const totalHeight = timelineList.scrollHeight;
    const railHeight = timelineScrollbar.clientHeight;
    const minThumbHeight = 28;
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
      visibleHeight,
      totalHeight,
      railHeight,
      thumbHeight,
      maxScrollTop,
      maxThumbTop,
    };
  }

  function setTimelineScrollFromThumbTop(thumbTop, metrics) {
    if (!timelineList) return;

    if (!metrics.maxThumbTop || !metrics.maxScrollTop) {
      timelineList.scrollTop = 0;
      return;
    }

    const progress = thumbTop / metrics.maxThumbTop;
    timelineList.scrollTop = progress * metrics.maxScrollTop;
  }

  function syncTimelineScrollbar() {
    if (!timelineList || !timelineScrollbar || !timelineScrollbarThumb) return;

    const metrics = getTimelineScrollMetrics();
    if (!metrics) return;

    if (
      metrics.totalHeight <= metrics.visibleHeight + 1 ||
      metrics.railHeight <= 0
    ) {
      timelineScrollbar.classList.add("is-hidden");
      return;
    }

    timelineScrollbar.classList.remove("is-hidden");

    const scrollProgress =
      metrics.maxScrollTop > 0
        ? timelineList.scrollTop / metrics.maxScrollTop
        : 0;
    const thumbTop = metrics.maxThumbTop * scrollProgress;

    timelineScrollbarThumb.style.height = `${metrics.thumbHeight}px`;
    timelineScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
  }

  function handleTimelineRailPointerDown(event) {
    if (!timelineScrollbar || !timelineScrollbarThumb || !timelineList) return;
    if (event.target === timelineScrollbarThumb) return;

    const metrics = getTimelineScrollMetrics();
    if (!metrics || metrics.maxThumbTop <= 0) return;

    const railRect = timelineScrollbar.getBoundingClientRect();
    const rawThumbTop = event.clientY - railRect.top - metrics.thumbHeight / 2;
    const thumbTop = Math.max(0, Math.min(rawThumbTop, metrics.maxThumbTop));

    setTimelineScrollFromThumbTop(thumbTop, metrics);
    syncTimelineScrollbar();
  }

  function handleTimelineThumbPointerDown(event) {
    if (!timelineScrollbarThumb || !timelineScrollbar) return;

    event.preventDefault();
    const thumbRect = timelineScrollbarThumb.getBoundingClientRect();
    timelineThumbDragOffsetY = event.clientY - thumbRect.top;
    isDraggingTimelineThumb = true;
    timelineScrollbarThumb.classList.add("is-dragging");
    timelineScrollbarThumb.setPointerCapture(event.pointerId);
  }

  function handleTimelineThumbPointerMove(event) {
    if (!isDraggingTimelineThumb || !timelineScrollbar || !timelineList) return;

    const metrics = getTimelineScrollMetrics();
    if (!metrics || metrics.maxThumbTop <= 0) return;

    const railRect = timelineScrollbar.getBoundingClientRect();
    const rawThumbTop = event.clientY - railRect.top - timelineThumbDragOffsetY;
    const thumbTop = Math.max(0, Math.min(rawThumbTop, metrics.maxThumbTop));

    setTimelineScrollFromThumbTop(thumbTop, metrics);
    syncTimelineScrollbar();
  }

  function stopTimelineThumbDragging(event) {
    if (!timelineScrollbarThumb) return;

    isDraggingTimelineThumb = false;
    timelineScrollbarThumb.classList.remove("is-dragging");

    if (
      event &&
      typeof event.pointerId === "number" &&
      timelineScrollbarThumb.hasPointerCapture(event.pointerId)
    ) {
      timelineScrollbarThumb.releasePointerCapture(event.pointerId);
    }
  }

  function syncProjectTagButtons() {
    projectFilterTagButtons.forEach(function (tagButton) {
      const tag = tagButton.dataset.tag;
      const isSelected = !!tag && selectedProjectTags.has(tag);

      tagButton.classList.toggle("is-active", isSelected);
      tagButton.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function applyProjectTagFilter() {
    if (!projectCards.length) return;

    if (!selectedProjectTags.size) {
      projectCards.forEach(function (card) {
        card.classList.remove("is-hidden");
      });
      return;
    }

    projectCards.forEach(function (card) {
      const cardTags = Array.from(card.querySelectorAll(".project-skill-tag"))
        .map(function (tagButton) {
          return tagButton.dataset.tag;
        })
        .filter(Boolean);

      const hasSelectedTag = cardTags.some(function (tag) {
        return selectedProjectTags.has(tag);
      });

      card.classList.toggle("is-hidden", !hasSelectedTag);
    });
  }

  function toggleProjectTagSelection(tag) {
    if (!tag) return;

    if (selectedProjectTags.has(tag)) {
      selectedProjectTags.delete(tag);
    } else {
      selectedProjectTags.add(tag);
    }

    syncProjectTagButtons();
    applyProjectTagFilter();
  }

  function syncBlogTagButtons() {
    blogFilterTagButtons.forEach(function (tagButton) {
      const tag = tagButton.dataset.tag;
      const isSelected = !!tag && selectedBlogTags.has(tag);

      tagButton.classList.toggle("is-active", isSelected);
      tagButton.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function applyBlogTagFilter() {
    if (!blogCards.length) return;

    if (!selectedBlogTags.size) {
      blogCards.forEach(function (card) {
        card.classList.remove("is-hidden");
      });
      return;
    }

    blogCards.forEach(function (card) {
      const cardTags = Array.from(card.querySelectorAll(".blog-skill-tag"))
        .map(function (tagButton) {
          return tagButton.dataset.tag;
        })
        .filter(Boolean);

      const hasSelectedTag = cardTags.some(function (tag) {
        return selectedBlogTags.has(tag);
      });

      card.classList.toggle("is-hidden", !hasSelectedTag);
    });
  }

  function toggleBlogTagSelection(tag) {
    if (!tag) return;

    if (selectedBlogTags.has(tag)) {
      selectedBlogTags.delete(tag);
    } else {
      selectedBlogTags.add(tag);
    }

    syncBlogTagButtons();
    applyBlogTagFilter();
  }

  function hideScrollAids() {
    if (scrollBottomAid) scrollBottomAid.classList.remove("is-visible");
    if (scrollTopAid) scrollTopAid.classList.remove("is-visible");
  }

  function scheduleHideScrollAids() {
    clearTimeout(hideScrollAidsTimeout);
    hideScrollAidsTimeout = setTimeout(hideScrollAids, scrollAidIdleMs);
  }

  function updateScrollAids() {
    if (!scrollBottomAid && !scrollTopAid) return;

    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;
    const nearTop = currentScrollY < 100;
    const nearBottom =
      window.innerHeight + currentScrollY >=
      document.documentElement.scrollHeight - 40;

    if (scrollBottomAid && isScrollingDown && !nearTop && !nearBottom) {
      scrollBottomAid.classList.add("is-visible");
    } else if (scrollBottomAid) {
      scrollBottomAid.classList.remove("is-visible");
    }

    if (scrollTopAid && isScrollingUp && !nearTop && !nearBottom) {
      scrollTopAid.classList.add("is-visible");
    } else if (scrollTopAid) {
      scrollTopAid.classList.remove("is-visible");
    }

    scheduleHideScrollAids();

    lastScrollY = currentScrollY;
  }

  if (projectFilterTagButtons.length) {
    projectFilterTagButtons.forEach(function (tagButton) {
      tagButton.setAttribute("aria-pressed", "false");
      tagButton.addEventListener("click", function () {
        toggleProjectTagSelection(tagButton.dataset.tag);
      });
    });

    applyProjectTagFilter();
  }

  if (blogFilterTagButtons.length) {
    blogFilterTagButtons.forEach(function (tagButton) {
      tagButton.setAttribute("aria-pressed", "false");
      tagButton.addEventListener("click", function () {
        toggleBlogTagSelection(tagButton.dataset.tag);
      });
    });

    applyBlogTagFilter();
  }

  if (scrollTopAid) {
    scrollTopAid.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      hideScrollAids();
    });
  }

  if (scrollBottomAid) {
    scrollBottomAid.addEventListener("click", function () {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });

      hideScrollAids();
    });
  }

  if (scrollBottomAid || scrollTopAid) {
    window.addEventListener("scroll", updateScrollAids, {
      passive: true,
    });

    updateScrollAids();
  }

  if (timelineList) {
    timelineList.addEventListener("scroll", syncTimelineScrollbar, {
      passive: true,
    });
  }

  if (timelineScrollbar) {
    timelineScrollbar.addEventListener(
      "pointerdown",
      handleTimelineRailPointerDown,
    );
  }

  if (timelineScrollbarThumb) {
    timelineScrollbarThumb.addEventListener(
      "pointerdown",
      handleTimelineThumbPointerDown,
    );
    timelineScrollbarThumb.addEventListener(
      "pointermove",
      handleTimelineThumbPointerMove,
    );
    timelineScrollbarThumb.addEventListener(
      "pointerup",
      stopTimelineThumbDragging,
    );
    timelineScrollbarThumb.addEventListener(
      "pointercancel",
      stopTimelineThumbDragging,
    );
  }

  window.addEventListener("resize", syncTimelineScrollbar);

  window.requestAnimationFrame(function () {
    showLatestTimelineEntry();
    syncTimelineScrollbar();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePage, { once: true });
} else {
  initHomePage();
}
