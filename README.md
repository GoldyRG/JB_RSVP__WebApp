# JB_RSVP__WebApp

A Justin Bieber-themed birthday RSVP site with one streamlined RSVP section.

## Features

- Bold concert-style visual theme with Bieber images around the RSVP card
- Single RSVP flow: guest name + number of people visiting
- Saves submissions in browser local storage
- Forwards RSVP details to the host using email draft (`mailto:`)
- Optional webhook forwarding for direct automated delivery

## Setup

1. Open [index.html](index.html) and set the host email in the form attribute:

```html
<form id="rsvpForm" data-host-email="your-email@example.com" novalidate>
```

2. Optional: set a webhook in [script.js](script.js) if you want direct POST delivery:

```js
window.RSVP_WEBHOOK_URL = "https://your-endpoint.example/rsvp";
```

## Run

Open [index.html](index.html) in a browser.
