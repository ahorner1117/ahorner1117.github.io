const author = "Anthony Horner";
const description =
	"Highly skilled software developer with a passion for coding, proficient in Next.js and React.js. Experienced in CMS and implementing CI/CD practices. Strong problem-solving abilities, excellent communication skills, and a collaborative mindset. Bachelor's degree in Computer Science.";
const url = "https://ahorner1117.github.io";
export const AppMetadata = {
	metadataBase: new URL("https://ahorner1117.github.io"),
	title: {
		default: `Portfolio | ${author}`,
		template: `%s | ${author}`
	},
	description: description,
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: "/headshot.ico"
	},
	keywords: [
		"Anthony Horner",
		"Anthony Horner - software developer",
		"Frontend developer",
		"Ecommerce developer",
		"Portfolio website",
		"Frontend Developer Portfolio",
		"Shopify developer"
	],
	creator: author,
	authors: [{ name: author, url: url }],
	openGraph: {
		title: `${author} | Portfolio`,
		description: description,
		url: url,
		siteName: `${author} | Portfolio`,
		images: [
			{
				url: "https://ahorner1117.github.io/headshot.jpg",
				width: 800,
				height: 600,
				alt: "My personal portfolio website"
			},
			{
				url: "https://ahorner1117.github.io/headshot.jpg",
				width: 1800,
				height: 1600,
				alt: "My personal portfolio website"
			}
		],
		locale: "en-US",
		type: "website"
	},
	twitter: {
		card: 'summary_large_image',
		title: `${author} | Software Developer Portfolio`,
		description: description,
		creator: '@ahorner1117',
		images: ['https://ahorner1117.github.io/headshot.jpg'],
	},
	alternates: {
		canonical: url,
	},
	other: {
		'theme-color': '#7928CA',
		'mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'black-translucent',
		'format-detection': 'telephone=no',
	}
};
