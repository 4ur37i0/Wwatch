#!/bin/sh
set -e

# Generate config.js from environment variables at container start
cat > /usr/share/nginx/html/config.js <<EOF
(function() {
  window.__TMDB_API_TOKEN__ = "${TMDB_API_TOKEN:-}";
  window.__TMDB_API_URL__ = "${TMDB_API_URL:-https://api.themoviedb.org/3}";
})();
EOF

exec "$@"
