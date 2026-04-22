const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function updateMusicButton(isPlaying) {
  if (!musicToggle) return;
  musicToggle.textContent = isPlaying ? "Pause" : "Play";
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
}

async function playMusic() {
  if (!music) return false;

  try {
    await music.play();
    updateMusicButton(true);
    return true;
  } catch {
    updateMusicButton(false);
    return false;
  }
}

function configureMusicElement() {
  if (!music) return;
  music.preload = "auto";
  music.setAttribute("playsinline", "");
  music.playsInline = true;
}

function applyPageSongSource() {
  if (!music) return;

  const pageSong = document.body?.dataset?.songSrc;
  const sourceTag = music.querySelector("source");

  if (pageSong && sourceTag && sourceTag.getAttribute("src") !== pageSong) {
    sourceTag.setAttribute("src", pageSong);
    music.load();
  }
}

function ensureWelcomeModalStyles() {
  if (document.getElementById("musicWelcomeStyles")) return;

  const style = document.createElement("style");
  style.id = "musicWelcomeStyles";
  style.textContent = `
    body.music-gate-open { overflow: hidden; }
    .music-welcome-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(8, 6, 14, 0.7);
      backdrop-filter: blur(6px);
    }
    .music-welcome-card {
      width: min(520px, 100%);
      border: 1px solid rgba(224, 170, 255, 0.36);
      border-radius: 18px;
      background: linear-gradient(150deg, rgba(31, 18, 52, 0.96), rgba(16, 10, 28, 0.95));
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.48);
      padding: 1.2rem;
      color: #f5f1ff;
      text-align: center;
    }
    .music-welcome-title {
      margin: 0;
      font-family: "Bebas Neue", Impact, sans-serif;
      letter-spacing: 0.04em;
      font-size: clamp(1.7rem, 7vw, 2.2rem);
    }
    .music-welcome-copy {
      margin: 0.5rem 0 1rem;
      color: #d5c7ea;
      font-size: 0.98rem;
    }
    .music-welcome-button {
      border: 0;
      border-radius: 999px;
      padding: 0.72rem 1.1rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      color: #0e0e10;
      background: linear-gradient(98deg, #7c3aed, #d4a5ff);
    }
  `;
  document.head.appendChild(style);
}

function openWelcomeModal() {
  ensureWelcomeModalStyles();

  const existing = document.getElementById("musicWelcomeOverlay");
  if (existing) existing.remove();

  const titleText =
    document.body?.dataset?.welcomeTitle || "Welcome to the Bieber Bash RSVP";
  const copyText =
    document.body?.dataset?.welcomeCopy || "Press Continue to start the music.";
  const buttonText =
    document.body?.dataset?.welcomeButton || "Continue";

  const overlay = document.createElement("div");
  overlay.id = "musicWelcomeOverlay";
  overlay.className = "music-welcome-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", titleText);

  overlay.innerHTML = `
    <div class="music-welcome-card">
      <h2 class="music-welcome-title">${titleText}</h2>
      <p class="music-welcome-copy">${copyText}</p>
      <button id="musicWelcomeContinue" class="music-welcome-button" type="button">${buttonText}</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("music-gate-open");

  const continueBtn = document.getElementById("musicWelcomeContinue");
  continueBtn?.addEventListener("click", async () => {
    if (music) {
      music.muted = false;
      await playMusic();
    }

    overlay.remove();
    document.body.classList.remove("music-gate-open");
  });
}

musicToggle?.addEventListener("click", async () => {
  if (!music) return;

  if (music.paused) {
    music.muted = false;
    await playMusic();
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  configureMusicElement();
  applyPageSongSource();
  openWelcomeModal();
  updateMusicButton(false);
});
