(function () {
  const API_BASE = "https://countapi.mileshilliard.com/api/v1";

  function init() {
    const el = document.getElementById("blog-download-stats");
    if (!el) return;

    let config;
    try {
      config = JSON.parse(el.dataset.config || "{}");
    } catch {
      return;
    }

    if (!config.enable || !config.views_key) return;

    const lang = el.dataset.lang === "zh" ? "zh" : "en";
    const labels = {
      en: { views: "Views" },
      zh: { views: "浏览" },
    };

    async function fetchCount(key, hit) {
      const endpoint = hit ? "hit" : "get";
      try {
        const response = await fetch(
          `${API_BASE}/${endpoint}/${encodeURIComponent(key)}`
        );
        if (!response.ok) return hit ? 0 : null;
        const data = await response.json();
        return Number(data.value) || 0;
      } catch {
        return hit ? 0 : null;
      }
    }

    function formatText(viewCount, downloadCounts) {
      const parts = [];
      if (viewCount !== null) {
        parts.push(`${labels[lang].views} ${viewCount}`);
      }

      (config.downloads || []).forEach((item, index) => {
        const count = downloadCounts[index];
        if (count === null) return;
        const label =
          (item.label && item.label[lang]) || item.match || "PDF";
        parts.push(`${label} ${count}`);
      });

      return parts.join(" · ");
    }

    async function refresh(hitViews) {
      const viewCount = await fetchCount(config.views_key, hitViews);
      const downloadCounts = await Promise.all(
        (config.downloads || []).map((item) => fetchCount(item.key, false))
      );
      const text = formatText(viewCount, downloadCounts);
      if (!text) return;
      el.textContent = text;
      el.hidden = false;
    }

    function bindDownloads() {
      (config.downloads || []).forEach((item) => {
        document
          .querySelectorAll(`a[href*="${item.match}"]`)
          .forEach((link) => {
            link.addEventListener("click", async () => {
              await fetchCount(item.key, true);
              await refresh(false);
            });
          });
      });
    }

    bindDownloads();
    refresh(true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
