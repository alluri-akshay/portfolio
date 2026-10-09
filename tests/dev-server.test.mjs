// Exercise the current source via the running server without reading stale
// production output or invoking a build. Override the URL for another port.
process.env.PORTFOLIO_TEST_URL ??= "http://localhost:3000";
await import("./rendered-html.test.mjs");
