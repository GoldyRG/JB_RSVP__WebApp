# JB_RSVP__WebApp

A Justin Bieber-themed birthday RSVP site with one streamlined RSVP section.

## Features

- Bold concert-style visual theme with Bieber images around the RSVP card
- Single RSVP flow: guest name + number of people visiting
- Saves submissions in browser local storage
- Optional RSVP forwarding to Formspree

## Setup

This site uses the **Vanilla JS (Ajax)** Formspree guide, because the app is a static HTML page with custom JavaScript validation and redirect behavior.

1. The Formspree endpoint is already wired into [script.js](script.js):

```js
const FORMSPREE_ENDPOINT_URL = "https://formspree.io/f/meevabwo";
```

2. Formspree will receive the RSVP as form fields like:

```json
{
  "guestName": "Bianca",
  "guestCount": 3,
  "guestNames": ["Guest 2", "Guest 3"],
  "attendance": "Accepted",
  "attendees": ["Bianca", "Guest 2", "Guest 3"],
  "submittedAt": "2026-04-17T00:00:00.000Z"
}
```

The submission also includes a single formatted `message` field so the Formspree dashboard and email view are easier to scan. Formspree does not let you fully control the column order in the submission table, so the message block is the cleanest way to keep the RSVP readable.

3. In Formspree, confirm the form is enabled and set to receive submissions.
4. Submit one RSVP from the site and check your Formspree inbox/dashboard.

## Run

Open [index.html](index.html) in a browser.
