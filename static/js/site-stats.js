(function () {
  const API_BASE = "https://countapi.mileshilliard.com/api/v1";

  function getLang() {
    return (document.documentElement.lang || "").startsWith("zh") ? "zh" : "en";
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

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

  async function detectCountry() {
    try {
      const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
      if (!response.ok) return null;
      const text = await response.text();
      const match = text.match(/^loc=(\w+)/m);
      return match ? match[1].toUpperCase() : null;
    } catch {
      return null;
    }
  }

  function countryName(code, lang) {
    if (code === "OTHER") {
      return lang === "zh" ? "其他" : "Other";
    }
    try {
      const locale = lang === "zh" ? "zh-CN" : "en";
      const displayNames = new Intl.DisplayNames([locale], { type: "region" });
      return displayNames.of(code) || code;
    } catch {
      return code;
    }
  }

  function countryIcon(code) {
    if (code === "OTHER") {
      return (
        '<svg class="site-stats-globe inline-block h-3.5 w-3.5 opacity-80" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.93 9h-3.15a15.3 15.3 0 0 0-1.2-4.76A8.03 8.03 0 0 1 19.93 11ZM12 4c.95 1.6 1.63 3.4 1.95 5.35H10.05C10.37 7.4 11.05 5.6 12 4ZM8.42 6.24A15.3 15.3 0 0 0 7.22 11H4.07a8.03 8.03 0 0 1 4.35-4.76ZM4.07 13h3.15c.2 1.65.58 3.22 1.2 4.76A8.03 8.03 0 0 1 4.07 13Zm5.98 0h3.9A13.2 13.2 0 0 1 12 18.7 13.2 13.2 0 0 1 10.05 13Zm5.98 4.76c.62-1.54 1-3.11 1.2-4.76h3.15a8.03 8.03 0 0 1-4.35 4.76ZM14.58 6.24A8.03 8.03 0 0 1 18.93 11h-3.15a15.3 15.3 0 0 0-1.2-4.76Z"/>' +
        "</svg>"
      );
    }
    return (
      `<span class="fi fi-${code.toLowerCase()} fis site-stats-flag" aria-hidden="true"></span>`
    );
  }

  function countryItem(code, count, lang) {
    const label = escapeHtml(countryName(code, lang));
    return (
      `<span class="inline-flex items-center gap-1" title="${label}">` +
      `${countryIcon(code)}<span>${count}</span></span>`
    );
  }

  function init() {
    const el = document.getElementById("site-views");
    if (!el) return;

    let config;
    try {
      config = JSON.parse(el.dataset.config || "{}");
    } catch {
      return;
    }

    if (!config.enable || !config.views_key) return;

    const lang = getLang();
    const viewsLabel = lang === "zh" ? "浏览" : "Views";
    const prefix = config.countries_key_prefix || "jeffxing-site-cc";
    const displayCountries = config.display_countries || [];
    const maxCountries = config.max_countries || 5;

    async function recordVisit() {
      await fetchCount(config.views_key, true);

      if (displayCountries.length === 0) return;

      const country = await detectCountry();
      if (!country) return;

      const bucket = displayCountries.includes(country) ? country : "OTHER";
      if (displayCountries.includes(bucket)) {
        await fetchCount(`${prefix}-${bucket.toLowerCase()}`, true);
      }
    }

    async function render() {
      const total = await fetchCount(config.views_key, false);
      if (total === null) return;

      const parts = [
        `<span class="inline-flex items-center gap-1">${viewsLabel} ${total}</span>`,
      ];

      if (displayCountries.length > 0) {
        const countryCounts = await Promise.all(
          displayCountries.map(async (code) => ({
            code,
            count: await fetchCount(`${prefix}-${code.toLowerCase()}`, false),
          }))
        );

        countryCounts
          .filter((item) => item.count !== null && item.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, maxCountries)
          .forEach((item) => {
            parts.push(countryItem(item.code, item.count, lang));
          });
      }

      el.innerHTML = parts.join('<span class="px-0.5 opacity-50">·</span>');
      el.hidden = false;
    }

    recordVisit().then(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
