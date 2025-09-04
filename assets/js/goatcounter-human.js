(function() {
  const isLikelyBot = () => {
    const ua = navigator.userAgent.toLowerCase();
    const suspiciousUA = /bot|crawl|spider|slurp|headless|phantom/i;
    const isHeadless = navigator.webdriver;
    const isTouchless = !('ontouchstart' in window);
    const isNoLang = !navigator.language;
    const isNoScreen = screen.width === 0 || screen.height === 0;

    return suspiciousUA.test(ua) || isHeadless || isTouchless || isNoLang || isNoScreen;
  };

  if (!isLikelyBot()) {
    window.goatcounter = {
      no_onload: true,
      path: location.pathname + location.search,
      title: document.title
    };

    const s = document.createElement("script");
    s.src = "https://gc.example.com/count.js"; // Replace with your GoatCounter URL
    s.defer = true;
    document.head.appendChild(s);
  } else {
    console.log("Bot traffic filtered: GoatCounter not loaded.");
  }
})();
