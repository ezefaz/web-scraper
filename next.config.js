/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// serverActions: true,
		serverComponentsExternalPackages: ["mongoose"],
	},
	images: {
		domains: [
			"m.media-mercadolibre.com",
			"static-catalog.tiendamia.com",
			"m.media-amazon.com",
			"http2.mlstatic.com",
			"valordolarblue.com.ar",
			"lh3.googleusercontent.com",
			"encrypted-tbn0.gstatic.com",
			"encrypted-tbn1.gstatic.com",
			"encrypted-tbn2.gstatic.com",
			"encrypted-tbn3.gstatic.com",
			"media-prod-use-1.mirakl.net",
			"res.cloudinary.com",
		],
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
