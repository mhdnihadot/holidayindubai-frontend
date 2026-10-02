// Writes public/sitemap.xml before each build: static pages + every category + every experience.
// If the API can't be reached, it still writes the static pages so the build never fails.
import { writeFileSync } from 'node:fs';

const SITE = 'https://www.holidayindubai.com';
const API = (process.env.VITE_API_URL || 'https://api.holidayindubai.com/api/v1').replace(/\/$/, '');

const staticPaths = ['/', '/projects', '/about', '/privacy', '/terms'];

const getList = async (path) => {
  try {
    const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const [projects, categories] = await Promise.all([getList('/project'), getList('/category')]);

const urls = [
  ...staticPaths.map((p) => ({ loc: `${SITE}${p}`, priority: p === '/' ? '1.0' : '0.6' })),
  ...categories
    .filter((c) => c?.name)
    .map((c) => ({ loc: `${SITE}/projects?category=${encodeURIComponent(c.name.trim())}`, priority: '0.7' })),
  ...projects
    .filter((p) => (p?.id || p?._id) && (p.status ?? 'active') === 'active')
    .map((p) => ({
      loc: `${SITE}/projects/${p.id || p._id}`,
      lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : undefined,
      priority: '0.8',
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} URLs (${projects.length} experiences, ${categories.length} categories)`);
