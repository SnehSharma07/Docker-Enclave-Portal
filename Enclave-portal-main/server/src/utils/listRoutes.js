/**
 * Explicit manifest of registered API routes, logged at startup so it's
 * immediately obvious in the terminal which endpoints a running server
 * actually has. This is the fastest way to catch a stale/old server
 * process during development - if these don't match what you expect,
 * the running process is not the one from your current source files.
 */
const ROUTE_MANIFEST = [
  "GET    /api/health",
  "POST   /api/contact",
  "GET    /api/admin/contacts",
  "GET    /api/admin/contacts/:id",
  "PUT    /api/admin/contacts/:id",
  "PATCH  /api/admin/contacts/:id/status",
  "DELETE /api/admin/contacts/:id",
];

export default ROUTE_MANIFEST;
