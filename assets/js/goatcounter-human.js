(function() {
  const isLikelyBot = () => {
    const ua = navigator.userAgent.toLowerCase();
    const suspiciousUA = /bot|crawl|spider|slurp|headless|phantom/i;
    const isHeadless = navigator.webdriver;       // automation hint
    const isNoScreen = screen.width === 0 || screen.height === 0;

    // Only consider UA patterns, headless automation, or impossible screens as bots
    return suspiciousUA.test(ua) || isHeadless || isNoScreen;
  };

  if (!isLikelyBot()) {
    window.goatcounter = {
      no_onload: true,
      path: location.pathname + location.search,
      title: document.title
    };

    const s = document.createElement("script");
    s.src = "//gc.zgo.at/count.js";              // GoatCounter hosted script
    s.defer = true;
    s.setAttribute("data-goatcounter", "https://shdkn.goatcounter.com/count");
    document.head.appendChild(s);
  } else {
    console.debug("Bot traffic filtered: GoatCounter not loaded.", navigator.userAgent);
  }
})();
