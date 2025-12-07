/** @type {import('next').NextConfig} */
const nextConfig = {
	// Only use static export for GitHub Pages builds
	// Vercel needs dynamic mode for API routes to work
	...(process.env.GITHUB_PAGES === 'true' && { output: 'export' }),

	images: { unoptimized: true },
	reactStrictMode: true,
	swcMinify: true,

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"]
		});
		return config;
	}
};

module.exports = nextConfig;
