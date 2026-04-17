# JB_RSVP__WebApp

A Justin Bieber-themed birthday RSVP site with one streamlined RSVP section.

## Features

- Bold concert-style visual theme with Bieber images around the RSVP card
- Single RSVP flow: guest name + number of people visiting
- Saves submissions in browser local storage
- Forwards RSVP details to Google Sheets through an Apps Script web app endpoint

## Setup

1. Open [script.js](script.js) and paste your Google Apps Script web app URL here:

```js
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/your-deployment-id/exec";
```

2. Create a Google Sheet with these columns in row 1:

```text
submittedAt | guestName | attendance | guestCount | guestNames | attendees
```

3. Paste this Apps Script into Extensions > Apps Script:

```javascript
function doPost(e) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVPs") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVPs");
	if (sheet.getLastRow() === 0) {
		sheet.appendRow(["submittedAt", "guestName", "attendance", "guestCount", "guestNames", "attendees"]);
	}

	sheet.appendRow([
		e.parameter.submittedAt || "",
		e.parameter.guestName || "",
		e.parameter.attendance || "",
		e.parameter.guestCount || "",
		e.parameter.guestNames || "",
		e.parameter.attendees || "",
	]);

	return ContentService.createTextOutput("ok");
}
```

4. Deploy the script as a Web App:
- Execute as: Me
- Who has access: Anyone

## Run

Open [index.html](index.html) in a browser.
