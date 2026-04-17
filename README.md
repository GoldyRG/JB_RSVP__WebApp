# JB_RSVP__WebApp

A Justin Bieber-themed birthday RSVP site with one streamlined RSVP section.

## Features

- Bold concert-style visual theme with Bieber images around the RSVP card
- Single RSVP flow: guest name + number of people visiting
- Saves submissions in browser local storage
- Optional RSVP forwarding to Formspree

## Setup

1. Create a Formspree form and copy your form endpoint URL.
2. Open [script.js](script.js) and paste it here:

```js
const FORMSPREE_ENDPOINT_URL = "https://formspree.io/f/your-form-id";
```

3. Formspree will receive the RSVP as form fields like:

```json
{
  "guestName": "Bianca",
  "guestCount": 3,
  "guestNames": ["Guest 2", "Guest 3"],
  "attendance": "rsvp",
  "attendees": ["Bianca", "Guest 2", "Guest 3"],
  "submittedAt": "2026-04-17T00:00:00.000Z"
}
```

4. In Formspree, confirm the form is enabled and set to receive submissions.

## Run

Open [index.html](index.html) in a browser.
