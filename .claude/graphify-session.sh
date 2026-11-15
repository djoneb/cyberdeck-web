#!/usr/bin/env bash
# Au démarrage d'une session Claude Code : (re)construit le graphe du code avec graphify (AST seul, sans clé d'API).
# Dans une session cloud (conteneur neuf), installe d'abord graphify. Sur un PC, ne fait rien si graphify n'est pas installé.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if ! command -v graphify >/dev/null 2>&1; then
  [ "$CLAUDE_CODE_REMOTE" = "true" ] || exit 0
  pip install -q graphifyy >/dev/null 2>&1 || exit 0
fi
if [ -f graphify-out/graph.json ]; then graphify update . >/dev/null 2>&1; else graphify extract . --code-only >/dev/null 2>&1; fi
exit 0
