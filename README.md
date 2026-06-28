# The Flood Archivist

A text-based browser game with a terminal-style UI. You are Vale, the last archivist
of Vellanthor, in the 72 hours before controlled flooding takes the city. Decide what
persists.

This is not a puzzle game — there are no correct answers, only a handcart with limited
room and a city full of people, objects, and stories asking to be carried, or witnessed,
or left behind.

Play in any browser: open `index.html`, or visit the GitHub Pages deployment of this
repo once enabled.

## Commands

- `look` / `l` — describe where you are
- `go [place]` — archive, river quarter, university annex, market, residential blocks, bridge
- `take [thing]` / `leave [thing]` — manage the handcart
- `examine` / `x [thing]`, `read [thing]` — look closer
- `talk to [person]` — a conversation
- `sit with [person]` — slower, costs more time, opens more
- `photograph [thing]` — if you're carrying the camera (limited film)
- `handcart` / `inventory` / `i` — what you're carrying
- `time` — hours remaining
- `wait` — let an hour pass
- `witness` — write a brief observation about where you are
- `new game` — start over

Significant actions cost hours, but the exact cost is never shown — only the running
counter. Progress autosaves to `localStorage` between sessions.

When the 72 hours run out, the game generates **WHAT YOU CARRIED**: a short prose
summary of what you saved, what you witnessed, and what you left behind.

## Deploying to GitHub Pages

This is a static site (`index.html`, `style.css`, `game.js`) with no build step.

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Pick the branch this game lives on and `/ (root)` as the folder.
4. Save — GitHub will publish the site at `https://<user>.github.io/<repo>/`.
