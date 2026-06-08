/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: process.env.GITHUB_PAGES_BASE_PATH || '',
	output: 'export',
	trailingSlash: true,
};

module.exports = nextConfig;
