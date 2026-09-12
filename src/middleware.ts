import type { MiddlewareHandler } from 'astro';

/**
 * Fork-local. Not part of the upstream distribution.
 *
 * The project was renamed from "ChatGPT Operated Site" to "Sitewright" on
 * 2026-09-12, which moved the official site to a new hostname. The old hostname
 * still resolves, so it answers with a permanent redirect rather than serving a
 * second copy of the same site at a second address.
 *
 * A zone-level redirect rule would be the better home for this, but the token
 * available here cannot write zone rulesets. When that rule exists, delete this
 * file and drop the old hostname from `routes` in wrangler.jsonc.
 */
const RETIRED_HOST = 'chatgpt-operated-site.data-range.com';
const CURRENT_ORIGIN = 'https://sitewright.data-range.com';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  if (url.hostname === RETIRED_HOST) {
    return new Response(null, {
      status: 301,
      headers: { location: `${CURRENT_ORIGIN}${url.pathname}${url.search}` }
    });
  }
  return next();
};
