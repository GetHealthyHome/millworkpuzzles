// Pre-launch signup: adds the email to Shopify's customer list with email-marketing consent.
// Auth is a Dev Dashboard app on our own store (client credentials grant, token lasts 24h).
const SHOP = process.env.SHOPIFY_SHOP; // store subdomain, e.g. "millworkpuzzles" (no .myshopify.com)
const API = '2026-10';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let cached = { token: null, until: 0 };

async function token() {
  if (cached.token && Date.now() < cached.until) return cached.token;
  const res = await fetch(`https://${SHOP}.myshopify.com/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.SHOPIFY_CLIENT_ID, client_secret: process.env.SHOPIFY_CLIENT_SECRET }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const { access_token, expires_in } = await res.json();
  cached = { token: access_token, until: Date.now() + (expires_in - 300) * 1000 };
  return access_token;
}

const CREATE = `mutation($input: CustomerInput!) { customerCreate(input: $input) { userErrors { field message } } }`;

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (body.company) return Response.json({ ok: true }); // honeypot: bots fill the hidden field
  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return Response.json({ ok: false, error: 'invalid' }, { status: 400 });

  try {
    const res = await fetch(`https://${SHOP}.myshopify.com/admin/api/${API}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': await token() },
      body: JSON.stringify({
        query: CREATE,
        variables: { input: { email, tags: ['waitlist'], emailMarketingConsent: { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' } } },
      }),
    });
    const json = await res.json();
    const errors = json.errors || json.data?.customerCreate?.userErrors || [];
    // shortcut: an existing customer counts as signed up without updating their consent; fine pre-launch (no customers yet).
    const taken = errors.length && errors.every((e) => /taken/i.test(e.message));
    if (!res.ok || (errors.length && !taken)) {
      console.error('shopify signup failed', res.status, JSON.stringify(errors));
      return Response.json({ ok: false }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('shopify signup failed', err.message);
    return Response.json({ ok: false }, { status: 502 });
  }
}
