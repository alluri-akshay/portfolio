// The optional database helper checks for this binding before using it.
// The public portfolio currently has no database binding configured.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
