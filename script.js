const music = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const sparkleLayer = document.getElementById("sparkleLayer");
const toast = document.getElementById("toast");
const photoCards = [...document.querySelectorAll(".photo-card")];
const galleryImages = photoCards.map((card) => ({
  image: card.querySelector("img"),
  caption: card.querySelector("figcaption")?.textContent.trim() || "A beautiful memory"
}));
let currentPhotoIndex = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// Play and Pause Music
musicToggle.addEventListener("click", async () => {

  if (music.paused) {

    try {
      await music.play();

      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Pause Music";

    } catch (error) {
      console.error("Music Error:", error);
      showToast("Music could not play. Please check your music file.");
    }

  } else {

    music.pause();

    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Play Music";

  }

});

// Reset button when music ends (if loop is removed)
music.addEventListener("ended", () => {
  musicToggle.setAttribute("aria-pressed", "false");
  musicLabel.textContent = "Play Music";
});


// Pause the background music while a video is playing.
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("play", () => {
    if (!music.paused) {
      music.pause();
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Play Music";
    }
  });
});

// Missing photos show a gentle designed placeholder instead of a broken-image icon.
function placeholderImage(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff7fa"/><stop offset="1" stop-color="#e8dcef"/></linearGradient></defs>
    <rect width="700" height="900" fill="url(#g)"/>
    <rect x="24" y="24" width="652" height="852" rx="10" fill="none" stroke="#c5a36b" stroke-width="2"/>
    <text x="350" y="405" text-anchor="middle" fill="#b27691" font-family="Georgia,serif" font-size="80">✿</text>
    <text x="350" y="485" text-anchor="middle" fill="#77566d" font-family="Arial,sans-serif" font-size="28">${label}</text>
    <text x="350" y="530" text-anchor="middle" fill="#9a8398" font-family="Arial,sans-serif" font-size="20">assets/images</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
galleryImages.forEach(({ image }) => {
  image.addEventListener("error", () => {
    image.classList.add("missing-photo");
    image.alt = "Photo placeholder — add your own photo file";
    image.src = placeholderImage("Add your photo here");
  }, { once: true });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}
function updateLightbox() {
  const item = galleryImages[currentPhotoIndex];
  lightboxImage.src = item.image.src;
  lightboxImage.alt = item.image.alt;
  lightboxCaption.textContent = item.caption;
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}
function moveLightbox(step) {
  currentPhotoIndex = (currentPhotoIndex + step + galleryImages.length) % galleryImages.length;
  updateLightbox();
}
photoCards.forEach((card, index) => {
  card.tabIndex = 0;
  card.addEventListener("click", () => openLightbox(index));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openLightbox(index);
  });
});
document.getElementById("lightboxPrev").addEventListener("click", () => moveLightbox(-1));
document.getElementById("lightboxNext").addEventListener("click", () => moveLightbox(1));
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

function celebrate(count = 100) {
  const colors = ["#d9a6b4", "#eee7f5", "#c5a36b", "#f3dfe6", "#b7a5c9", "#fffdfd"];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--confetti-color", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty("--fall-time", `${2.5 + Math.random() * 2.5}s`);
    piece.style.setProperty("--drift", `${Math.round(Math.random() * 180 - 90)}px`);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    if (Math.random() > 0.5) piece.style.borderRadius = "50%";
    fragment.appendChild(piece);
  }
  sparkleLayer.appendChild(fragment);
  window.setTimeout(() => sparkleLayer.replaceChildren(), 6500);
}
document.getElementById("surpriseButton").addEventListener("click", () => {
  celebrate(125);
  document.getElementById("finale").scrollIntoView({ behavior: "smooth" });
  showToast("A little birthday wish from Esha, with respect. Happy Birthday, Maani Sir!");
});
document.getElementById("celebrateButton").addEventListener("click", () => {
  celebrate(150);
  showToast("Happy Birthday, Respected Maani Sir! ✨");
});
window.addEventListener("load", () => {
  window.setTimeout(() => celebrate(36), 500);
});
