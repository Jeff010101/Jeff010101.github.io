(function () {
  const API_BASE = "https://countapi.mileshilliard.com/api/v1";

  function init() {
    const el = document.getElementById("site-views");
    if (!el || !el.dataset.viewsKey) return;

    const lang = (document.documentElement.lang || "").startsWith("zh")
      ? "zh"
      : "en";
    const label = lang === "zh" ? "浏览" : "Views";

    async function fetchCount(hit) {
      const endpoint = hit ? "hit" : "get";
      try {
        const response = await fetch(
          `${API_BASE}/${endpoint}/${encodeURIComponent(el.dataset.viewsKey)}`
        );
        if (!response.ok) return hit ? 0 : null;
        const data = await response.json();
        return Number(data.value) || 0;
      } catch {
        return hit ? 0 : null;
      }
    }

    async function refresh(hit) {
      const count = await fetchCount(hit);
      if (count === null) return;
      el.textContent = `${label} ${count}`;
      el.hidden = false;
    }

    refresh(true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
