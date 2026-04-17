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

async function attemptAutoplay() {
  if (!music) return;

  const pageSong = document.body?.dataset?.songSrc;
  const sourceTag = music.querySelector("source");

  if (pageSong && sourceTag && sourceTag.getAttribute("src") !== pageSong) {
    sourceTag.setAttribute("src", pageSong);
    music.load();
  }

  await playMusic();
}

function setupFirstInteractionAutoplay() {
  if (!music || !music.paused) return;

  const startOnInteraction = async () => {
    const didPlay = await playMusic();
    if (didPlay) {
      removeInteractionListeners();
    }
  };

  const removeInteractionListeners = () => {
    window.removeEventListener("pointerdown", startOnInteraction);
    window.removeEventListener("keydown", startOnInteraction);
  };

  window.addEventListener("pointerdown", startOnInteraction);
  window.addEventListener("keydown", startOnInteraction);
}

musicToggle?.addEventListener("click", async () => {
  if (!music) return;

  if (music.paused) {
    await playMusic();
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

window.addEventListener("load", () => {
  void attemptAutoplay();
  setupFirstInteractionAutoplay();
});
