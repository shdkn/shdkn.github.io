const sheetID = "1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw";
const colors = [
  "#3A3647", "#1C262E", "#692B17", "#0C625D", "#5A6361",
  "#4B455E", "#596C39", "#396C5D", "#6C394F", "#284255"
];

let allProducts = [];
let currentIndex = 0;
const batchSize = 12;

async function loadProducts() {
  if (!tabName) return console.error("Missing tabName for sheet fetch");

  try {
    const url = `https://opensheet.elk.sh/${sheetID}/${tabName}`;
    const res = await fetch(url);
    const data = await res.json();

    allProducts = data
      .filter(item => item.title && item.img && item.link)
      .sort((a, b) => Number(a.shuffleID) - Number(b.shuffleID));

    renderNextBatch();
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function generateCardHTML(item, index) {
  const imageArray = item.img.split(',');
  const carouselHTML = imageArray.map((url, i) =>
    `<img src="${url.trim()}" class="${i === 0 ? 'active' : ''}" loading="lazy" alt="${item.title}" />`
  ).join('');

  return `
    <div class="carousel" data-seed="${item.shuffleID}">
      ${carouselHTML}
    </div>
    <div class="spacer"></div>
    <h3 class="title-text">${item.title.replace(/\n/g, '<br>')}</h3>
    <div class="buy-divider"></div>
    <div class="buy-button-wrapper">
      <a class="buy-button action-button-text" href="${item.link}" target="_blank" aria-label="Buy ${item.title}">👉👉 Link</a>
    </div>
  `;
}

function renderNextBatch() {
  const grid = document.querySelector("main.grid");
  if (!grid) return;

  const nextItems = allProducts.slice(currentIndex, currentIndex + batchSize);

  nextItems.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("role", "article");
    card.setAttribute("aria-label", item.title);
    card.style.backgroundColor = colors[(currentIndex + i) % colors.length];
    card.style.transitionDelay = `${i * 100}ms`;
    card.innerHTML = generateCardHTML(item, i);

    grid.appendChild(card);
    observer.observe(card);
  });

  activateCarousels(".carousel");
  currentIndex += batchSize;
}

function activateCarousels(selector = ".carousel") {
  document.querySelectorAll(selector).forEach((carousel, index) => {
    if (carousel.dataset.activated === "true") return;
    carousel.dataset.activated = "true";

    const images = carousel.querySelectorAll("img");
    if (images.length <= 1) return;

    let current = 0;

    function shuffle() {
      images.forEach((img, i) => img.classList.toggle("active", i === current));
      current = (current + 1) % images.length;

      const seed = Number(carousel.dataset.seed) || index;
      const nextDelay = 2000 + (seed % 3000);
      setTimeout(shuffle, nextDelay);
    }

    const initialDelay = Math.floor(Math.random() * 3000);
    setTimeout(shuffle, initialDelay);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.1 });

window.addEventListener("DOMContentLoaded", loadProducts);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollY + viewportHeight >= fullHeight - 100 && currentIndex < allProducts.length) {
    renderNextBatch();
  }

  const backBtn = document.getElementById("backToTop");
  if (backBtn) {
    backBtn.style.display = scrollY > 300 ? "block" : "none";
  }
});

document.getElementById("backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
