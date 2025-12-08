const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ahorner1117.github.io';

// Define all URLs in the site
const pages = [
  { url: '', changefreq: 'weekly', priority: 1.0 }, // Homepage
  { url: '#intro', changefreq: 'weekly', priority: 0.9 },
  { url: '#about', changefreq: 'monthly', priority: 0.8 },
  { url: '#projects', changefreq: 'weekly', priority: 0.9 },
  { url: '#ai', changefreq: 'monthly', priority: 0.7 },
  { url: '#tech', changefreq: 'monthly', priority: 0.7 },
  // Note: /clients page is on Vercel, not in static export
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, sitemap);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
