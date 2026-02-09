// Script to inject environment variables at runtime
(function() {
  window.__TMDB_API_TOKEN__ = process.env['TMDB_API_TOKEN'] || '';
})();
