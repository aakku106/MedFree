<!-- @format -->

Tax Flow Tree — UI Demo

This is a self-contained static demo used for a hackathon video. It visualizes a hierarchical tree of government tax accounts (Central → Province → District → City) and simulates "money" transfers up the tree.

Files:

- index.html — main demo page
- styles.css — styling
- main.js — D3-based visualization and simulated transfers

How to run:

Open `index.html` in a browser (double-click or use a simple static server). For a local static server you can run:

python3 -m http.server 8000

Then open http://localhost:8000 in your browser and navigate to the `ui-demo` folder.

Notes for the video:

- The animation shows particles moving up the tree to indicate funds being aggregated to the central account.
- Double-click a node to open the Citizen Portal details on the right. Use the mock "Vote" or "Add Comment" buttons to record demo activity.

This is a UI-only demo and does not connect to any backend or blockchain.
