const purpleRange = document.getElementById("purpleRange");
const glowToggle = document.getElementById("glowToggle");
const motionToggle = document.getElementById("motionToggle");
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("status");

const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  document.body.classList.add("no-motion");
  if (motionToggle) {
    motionToggle.checked = true;
  }
}

purpleRange?.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  document.documentElement.style.setProperty("--purple-l", `${value}%`);
});

glowToggle?.addEventListener("change", () => {
  document.body.classList.toggle("no-glow", !glowToggle.checked);
});

motionToggle?.addEventListener("change", () => {
  document.body.classList.toggle("no-motion", motionToggle.checked);
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!name || !email) {
    if (statusEl) {
      statusEl.textContent = "Please enter both name and email.";
    }
    return;
  }

  if (statusEl) {
    statusEl.textContent = `Thanks ${name}! Your RSVP is saved for JB's party.`;
  }
  form.reset();
  if (glowToggle) {
    glowToggle.checked = !document.body.classList.contains("no-glow");
  }
  if (motionToggle) {
    motionToggle.checked = document.body.classList.contains("no-motion");
  }
});
