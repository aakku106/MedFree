Quick orientation

This repository currently contains two Next.js applications, but development work is focused only on medfree/.

🚫 osteon/ is off-limits — do not modify, refactor, or touch files in osteon/.
✅ Only work inside the medfree/ app and relevant shared config when explicitly needed.

Active App: medfree/
	•	Path: medfree/
	•	Tech: Next.js (App Router), Clerk authentication
	•	Middleware: see medfree/middleware.ts
	•	Environment: requires Clerk keys from .env

Running the project

cd medfree && npm run dev

Auth
	•	Uses Clerk
	•	Environment variables are loaded from .env
	•	Make sure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY exists

Database
	•	Uses MongoDB
	•	Local .env.local contains:

MONGODB_URI=your_connection_string_here

MongoDB connection logic follows Next.js & Clerk best practices

Forbidden: osteon/

Do not modify anything in osteon/. Notes about osteon are intentionally removed from this file.

If you encounter references to code in osteon/, ignore them, and continue working only within medfree/.

General Agent / Copilot Goals
	•	Make small, safe edits
	•	Only modify medfree/*
	•	Match patterns already in this project
	•	Avoid cross-app changes unless explicitly requested
	•	Follow Next.js App Router conventions

Env Notes
	•	.env holds Clerk public keys
	•	.env.local holds private DB credentials

Research folder

All developer context and planning material lives in the /Research folder.
Use that folder for understanding architecture, restrictions, and goals.

⸻

If you need more structure (examples, API docs, folder breakdown, or allowed edit rules), ask before making broad changes.