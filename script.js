(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link (mobile)
    navLinks.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  // Profile image fallback if missing
  const profileImg = document.getElementById("profile-img");
  const avatarFallback = document.getElementById("avatar-fallback");
  if (profileImg && avatarFallback && profileImg instanceof HTMLImageElement) {
    const showFallback = () => {
      profileImg.style.display = "none";
      avatarFallback.style.display = "grid";
    };

    avatarFallback.style.display = "none";
    if (!profileImg.complete) {
      profileImg.addEventListener("error", showFallback, { once: true });
    } else if (profileImg.naturalWidth === 0) {
      showFallback();
    }
  }

  // Smooth scrolling with sticky-header offset
  const getHeaderOffset = () => (header ? header.getBoundingClientRect().height : 0);
  navAnchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      const section = document.getElementById(id);
      if (!section) return;
      e.preventDefault();

      const y = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.pushState(null, "", href);
    });
  });

  // Active nav highlighting
  const sections = navAnchors
    .map((a) => (a.getAttribute("href") || "").slice(1))
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length > 0) {
    const byId = new Map(navAnchors.map((a) => [(a.getAttribute("href") || "").slice(1), a]));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (!visible || !(visible.target instanceof HTMLElement)) return;
        const activeId = visible.target.id;

        navAnchors.forEach((a) => a.classList.remove("is-active"));
        const activeLink = byId.get(activeId);
        if (activeLink) activeLink.classList.add("is-active");
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
        rootMargin: `-${getHeaderOffset() + 16}px 0px -55% 0px`,
      }
    );

    sections.forEach((s) => observer.observe(s));
  }
})();

