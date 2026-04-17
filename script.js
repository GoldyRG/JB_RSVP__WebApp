const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("status");
const guestCountInput = document.getElementById("guestCount");
const guestNamesGroup = document.getElementById("guestNamesGroup");
const guestNamesInputsContainer = document.getElementById("guestNamesInputs");
const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
const STORAGE_KEY = "jbBirthdayRsvps";
const FORMSPREE_ENDPOINT_URL = "https://formspree.io/f/meevabwo";

function setStatus(message, variant) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove("ok", "warn");
  if (variant) {
    statusEl.classList.add(variant);
  }
}

function saveRsvp(entry) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const saved = raw ? JSON.parse(raw) : [];
  saved.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

async function forwardRsvp(entry) {
  if (!FORMSPREE_ENDPOINT_URL) {
    return { sent: false, reason: "not-configured" };
  }

  try {
    const formData = new FormData();
    formData.append("guestName", entry.guestName);
    formData.append("attendance", entry.attendance === "rsvp" ? "Accepted" : "Declined");
    formData.append("guestCount", String(entry.guestCount));
    formData.append("guestNames", entry.guestNames.join(" | "));
    formData.append("attendees", entry.attendees.join(" | "));
    formData.append("submittedAt", entry.submittedAt);
    formData.append("subject", "Bianca's Bieber Bash RSVP");
    formData.append(
      "message",
      [
        `Guest Name: ${entry.guestName}`,
        `Attendance: ${entry.attendance === "rsvp" ? "Accepted" : "Declined"}`,
        `Number of People: ${entry.guestCount || 0}`,
        `Additional Guests: ${entry.guestNames.length ? entry.guestNames.join(", ") : "None"}`,
        `All Attendees: ${entry.attendees.join(", ")}`,
        `Submitted At: ${entry.submittedAt}`,
      ].join("\n"),
    );

    const response = await fetch(FORMSPREE_ENDPOINT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Formspree rejected the submission.";
      try {
        const errorBody = await response.json();
        if (errorBody?.errors?.length) {
          errorMessage = errorBody.errors.map((error) => error.message).join(" ");
        }
      } catch {
        // Keep the default message when the response body is not JSON.
      }

      return { sent: false, reason: errorMessage };
    }

    return { sent: true };
  } catch {
    return { sent: false, reason: "network-error" };
  }
}

function renderGuestNameInputs(count) {
  if (!guestNamesInputsContainer) return;

  guestNamesInputsContainer.innerHTML = "";

  const additionalGuests = Math.max(count - 1, 0);

  for (let i = 1; i <= additionalGuests; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "guest-name-input-wrapper";

    const label = document.createElement("label");
    label.textContent = `Guest ${i + 1}`;

    const input = document.createElement("input");
    input.type = "text";
    input.name = `guestName_${i}`;
    input.placeholder = `Name of guest ${i + 1}`;
    input.required = true;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    guestNamesInputsContainer.appendChild(wrapper);
  }
}

function toggleGuestCountState(attendance) {
  if (!guestCountInput) return;

  const isDeny = attendance === "deny";
  guestCountInput.disabled = isDeny;

  if (isDeny) {
    guestCountInput.value = "0";
  } else if (Number(guestCountInput.value) < 1) {
    guestCountInput.value = "1";
  }
}

function toggleGuestNamesState() {
  if (!guestNamesGroup || !guestNamesInputsContainer || !guestCountInput) return;

  const attendance = document.querySelector('input[name="attendance"]:checked')?.value || "rsvp";
  const guestCount = Number(guestCountInput.value || 0);
  const shouldShow = attendance === "rsvp" && guestCount > 1;

  guestNamesGroup.hidden = !shouldShow;

  if (shouldShow) {
    renderGuestNameInputs(guestCount);
  } else {
    guestNamesInputsContainer.innerHTML = "";
  }
}

attendanceInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      toggleGuestCountState(input.value);
      toggleGuestNamesState();
    }
  });
});

guestCountInput?.addEventListener("input", () => {
  toggleGuestNamesState();
});

toggleGuestCountState(document.querySelector('input[name="attendance"]:checked')?.value || "rsvp");
toggleGuestNamesState();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const guestName = String(formData.get("guestName") || "").trim();
  const attendance = String(formData.get("attendance") || "").trim();
  const guestCount = attendance === "deny" ? 0 : Number(formData.get("guestCount") || 0);

  // Collect guest names from individual inputs
  const guestNames = [];
  for (let i = 1; i < guestCount; i++) {
    const name = String(formData.get(`guestName_${i}`) || "").trim();
    if (name) {
      guestNames.push(name);
    }
  }

  if (!guestName) {
    setStatus("Please add your name before sending your RSVP.", "warn");
    return;
  }

  if (attendance !== "rsvp" && attendance !== "deny") {
    setStatus("Please choose Accept or Decline.", "warn");
    return;
  }

  if (attendance === "rsvp" && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20)) {
    setStatus("Choose a whole number between 1 and 20.", "warn");
    guestCountInput?.focus();
    return;
  }

  const expectedAdditionalGuests = attendance === "rsvp" ? Math.max(guestCount - 1, 0) : 0;

  if (attendance === "rsvp" && expectedAdditionalGuests > 0 && guestNames.length !== expectedAdditionalGuests) {
    setStatus(`Please enter all guest names.`, "warn");
    return;
  }

  const entry = {
    guestName,
    guestCount,
    guestNames,
    attendance,
    attendees: [guestName, ...guestNames],
    submittedAt: new Date().toISOString(),
  };

  try {
    saveRsvp(entry);
  } catch {
    setStatus("Could not save RSVP in this browser. Please try again.", "warn");
    return;
  }

  const deliveryResult = await forwardRsvp(entry);
  if (FORMSPREE_ENDPOINT_URL && !deliveryResult.sent) {
    setStatus(
      `Saved locally, but Formspree rejected the submission. ${deliveryResult.reason}`,
      "warn",
    );
    return;
  }

  setStatus("Saved. Redirecting...", "ok");

  const nextPage = attendance === "rsvp" ? "./success.html" : "./sorry.html";
  window.location.href = nextPage;
});
