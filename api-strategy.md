**Connecting React + Vite to Google Sheets Securely**
Because Vite is a purely client-side framework, you cannot place Google Sheets API keys directly in the React code. The AI agent must implement the following middleware pattern:

1. **Google Apps Script (The Middleware):**
   - Create a Google Apps Script attached to the target Google Sheet.
   - Write a `doPost(e)` function in the script to receive JSON payloads from the React app.
   - The script parses the payload (e.g., login data, contact form, reviews) and uses `Sheet.appendRow()` to insert the data.
   - Deploy the script as a "Web App" accessible to "Anyone".

2. **Vite Frontend (The Client):**
   - The React app uses the native `fetch()` API to send a POST request to the provided Google Apps Script Web App URL.
   - This keeps all Google credentials completely out of the Vite build, ensuring zero security leaks while fulfilling the backend-free requirement.