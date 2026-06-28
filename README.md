# The Flood Archivist

A text-based browser game with a terminal-style UI. You are the last archivist in the
city of Veshara, with minutes left before the levees fail. Explore the archive, decide
what to carry, and reach the roof before the water decides for you.

Play in any browser: open `index.html`, or visit the GitHub Pages deployment of this
repo once enabled.

## Commands

- `look` — describe where you are
- `go <direction>` (or `n/s/e/w/u/d`) — move around the building
- `examine <item>` — inspect or read something
- `take <item>` — pick something up (5-item carry limit)
- `drop <item>` — leave something behind
- `unlock <item> with <key>` — open something locked
- `inventory` / `i` — see what you're carrying
- `status` — check the water level and time elapsed
- `evacuate` — from the roof hatch, end the game with what you're carrying
- `restart` — play again

Every action but looking, examining, checking inventory/status, and help costs time —
and the water never stops rising.

## Deploying to GitHub Pages

This is a static site (`index.html`, `style.css`, `game.js`) with no build step.

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Pick the branch this game lives on and `/ (root)` as the folder.
4. Save — GitHub will publish the site at `https://<user>.github.io/<repo>/`.
