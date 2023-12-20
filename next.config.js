/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: 'export',

	exportPathMap: function () {
		return {
		  '/': { page: '/' },
		  // Add other routes as needed
		};
	  },
	  
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
