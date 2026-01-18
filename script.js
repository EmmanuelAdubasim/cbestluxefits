(function () {
  // ---------- SLIDER SETUP ----------
  function setupSlider(trackSelector, btnSelector) {
    const track = document.querySelector(trackSelector);
    if (!track) return;

    const btns = document.querySelectorAll(btnSelector);

    const cardWidth = () => {
      const firstCard = track.querySelector(".slide");
      const w = firstCard ? firstCard.getBoundingClientRect().width : 280;
      return w + 18;
    };

    // Buttons
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = Number(btn.getAttribute("data-dir")) || 1;
        const targetSel = btn.getAttribute("data-target");
        const t = targetSel ? document.querySelector(targetSel) : track;
        if (!t) return;
        t.scrollBy({ left: dir * cardWidth(), behavior: "smooth" });
      });
    });

    // Auto-scroll (pause on hover/touch)
    let auto = setInterval(() => track.scrollBy({ left: cardWidth(), behavior: "smooth" }), 3500);

    const pause = () => clearInterval(auto);
    const resume = () => {
      clearInterval(auto);
      auto = setInterval(() => track.scrollBy({ left: cardWidth(), behavior: "smooth" }), 3500);
    };

    ["mouseenter", "touchstart", "focusin"].forEach((e) => track.addEventListener(e, pause));
    ["mouseleave", "touchend", "focusout"].forEach((e) => track.addEventListener(e, resume));
  }

  // Bestsellers slider (controls without data-target)
  setupSlider("#productTrack", ".slider-controls .icon-btn:not([data-target])");
  // New arrivals
  setupSlider("#newTrack", '.slider-controls .icon-btn[data-target="#newTrack"]');
  // More picks
  setupSlider("#moreTrack", '.slider-controls .icon-btn[data-target="#moreTrack"]');

  // ---------- CATEGORY TABS (filter Bestsellers only) ----------
  const tabs = document.getElementById("productTabs");
  const productTrack = document.getElementById("productTrack");

  if (tabs && productTrack) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;

      tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.getAttribute("data-cat");
      productTrack.querySelectorAll(".slide").forEach((card) => {
        const show = cat === "All" || card.getAttribute("data-cat") === cat;
        card.style.display = show ? "" : "none";
      });
    });
  }

  // ---------- OPEN / CLOSED STATUS (LAGOS TIME) ----------
  function getLagosDate() {
    // Gets a Date object representing current time in Africa/Lagos
    // (works in modern browsers)
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const map = {};
    parts.forEach((p) => (map[p.type] = p.value));

    return new Date(
      `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`
    );
  }

  function updateStoreStatus() {
    const el = document.getElementById("storeStatus");
    if (!el) return;

    const lagos = getLagosDate();
    const day = lagos.getDay(); // 0=Sun
    const hour = lagos.getHours() + lagos.getMinutes() / 60;

    let open = false;

    // Mon-Fri: 9:00 - 17:00
    if (day >= 1 && day <= 5) open = hour >= 9 && hour < 17;
    // Sat: 10:00 - 15:00
    if (day === 6) open = hour >= 10 && hour < 15;
    // Sun: closed

    el.textContent = open ? "🟢 We are OPEN now" : "🔴 Currently CLOSED";
    el.classList.remove("open", "closed");
    el.classList.add(open ? "open" : "closed");
  }

  updateStoreStatus();
  // Refresh every 60 seconds
  setInterval(updateStoreStatus, 60000);
})();
