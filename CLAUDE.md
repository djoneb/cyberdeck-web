# Cyberdeck web — carte du projet

Version web du jeu Cyberdeck (NEO-BXL, 2089) et page de téléchargement de l'appli, servis par GitHub Pages depuis `main`
(domaine cyberdeck.eu1z.com). L'appli Android est dans le dépôt `djoneb/Cyber-punk-launcher-`.
Réponses à l'utilisateur : en français.

## Où trouver quoi
- `index.html` + `js/app.js` : page du jeu, navigation entre les onglets, annonces NEURA.
- `js/world.js` : toute la logique du jeu (lieux, rencontres et `whereIs`, expéditions, zones, météo, histoires) — miroir de l'appli.
- `js/city.js` : écran de la ville (carte, page quartier/zone avec carte animée, histoires, fiches des lieux).
- `js/holophone.js`, `js/neuralog.js`, `js/quests*.js`, `js/market.js`, `js/games.js` : contacts, journal NEURA, quêtes, marché, mini-jeux.
- `js/gamedata.js` : GÉNÉRÉ depuis le code de l'appli par `scripts/ktdata.py` (contacts, lieux, `dossiers.json`, `stories.json`) — ne pas modifier à la main.
- `js/krand.js` : générateur aléatoire identique à celui de Kotlin, pour que le site et l'appli tirent les mêmes résultats.
- Cartes holo : moteur dans `holocards-src/engine.js`, compilé par `scripts/build_holocards.mjs` vers `js/holocards.js` ; images dans `cards/<id>.webp`.
- `zonemaps/index.html` : cartes animées des zones (copie de celle de l'appli).
- `telecharger.html`, `js/dltrack.js`, `stats.html` : téléchargement de l'appli et statistiques.
- `relay/` : relais Cloudflare (transfert de partie par QR code), déployé par `.github/workflows/pages.yml`.

## Règle
Toute règle de jeu changée ici doit l'être aussi dans l'appli (et inversement) : le site et l'appli partagent la même sauvegarde.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
