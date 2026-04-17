const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function updateMusicButton(isPlaying) {
  if (!musicToggle) return;
  musicToggle.textContent = isPlaying ? "Pause" : "Play";
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
}

async function attemptAutoplay() {
  if (!music) return;

  const pageSong = document.body?.dataset?.songSrc;
  const sourceTag = music.querySelector("source");

  if (pageSong && sourceTag && sourceTag.getAttribute("src") !== pageSong) {
    sourceTag.setAttribute("src", pageSong);
    music.load();
  }

  try {
    await music.play();
    updateMusicButton(true);
  } catch {
    updateMusicButton(false);
  }
}

musicToggle?.addEventListener("click", async () => {
  if (!music) return;

  if (music.paused) {
    try {
      await music.play();
      updateMusicButton(true);
    } catch {
      updateMusicButton(false);
    }
  } else {
    music.pause();
    updateMusicButton(false);
  }
});

window.addEventListener("load", () => {
  void attemptAutoplay();
});
