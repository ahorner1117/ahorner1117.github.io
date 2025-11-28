import { domAnimation, LazyMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { HeadingDivider } from "components";

const experiences = [
	{
		company: "Legends",
		id: 1,
		role: "Ecommerce Developer",
		date: "11.2022 - Present",
		description: [
			"Spearheaded upgrades for multiple Shopify stores, introducing checkout extensibility for enhanced functionality.",
			"Developed versatile Shopify checkout extensibility apps, including one leveraging React for universal employee discounts and another displaying pickup times and locations in checkout, streamlining the selection process for users.",
			"Continued to enhance the customizable, headless Next.js and React E-commerce store on the Shopify platform, ensuring adaptability to emerging technologies and evolving business needs.",
			"Employed GraphQL for API calls, optimizing data retrieval and interaction with Shopify's Admin API and Storefront API.",
			"Implemented custom use hooks and utilized Redux for efficient state management, ensuring a robust architecture for the E-commerce platform.",
			"Integrated Contentful headless CMS seamlessly using GraphQL queries and mutations for dynamic data access.",
			"Translated Figma and Photoshop design files into responsive web interfaces, prioritizing a visually appealing and user-friendly experience across devices."
		]
	},
	{
		company: "Preddio Technologies",
		role: "Application Engineer",
		id: "2",

		date: "06.2022 - 11.2022",
		description: [
			"Developed API routes using Node.js and Express to transfer data packets gathered from bluetooth gateways to their corresponding cloud portal.",
			"Developed server-side logic, including data storage and optimizing website performance.",
			"Developed dynamic user-role based components focused on security and user permissions."
		]
	},
	{
		company: "Redcon1",
		id: 3,

		role: "Front End Developer",
		date: "03.2021 - 06.2022",
		description: [
			"Using Javascript, created QR code with augmented reality to provide product information. Inside Walmart, customers can scan corresponding QR code and point their camera at any product to see an informative video explaining the products objective.",
			"Implemented Shopify buy button using Javascript and jQuery to bind shopping carts across multiple domains using Shopify and Wordpress",
			"Setup affiliate program to reimburse company brand ambassadors programtically based on their amount of sales each month.",
			"Implemented Algolia third party search functionality through a customized build, added search filters based on customer type, built product and collection filters for search page."
		]
	},
	{
		company: "Insurance Express",
		id: 4,

		role: "Software Developer",
		date: "11.2020 - 03.2021",
		description: [
			"Developed Java application with maven using selenium to parse CSV files containing call records from our softphone, used that data to make REST API calls to a CRM to update the deal stage based on the disposition of the call.",
			"Created a Java web application to make API requests to update hundreds of thousands of customer records and cancel insurance policies if customer did not pay their premium, stored updates in MySQL database. The front end GUI contained charts from google charts API to display customers policy cancellations by month.",
			"Created custom email signatures using HTML and CSS for entire company."
		]
	},
	{
		company: "Anju Software",
		role: "Clinical Development Intern",
		date: "07.2019 - 11.2020",
		id: 5,
		mainTech: ["T-SQL", "fa fa-database"],
		description: [
			"Designed, developed and maintained clinical trial components from initial build throughout the entire study build project lifecycle.",
			"Built new clinical trial database components based on the interpretation of study build requirements within assigned timelines.",
			"Restored databases and analyzed data discrepancies between the UI and the database using SQL scripts in SSMS and excel."
		]
	}
];

const TimelineItem = ({ experience, side, index }) => {
	const ref = useRef(null);

	const isItemInView = useInView(ref, { once: true });

	const descriptionList = experience.description.map((point, idx) => (
		<li key={idx} className="mb-2 flex items-start">
			<span className="mr-2 mt-1.5 text-gray-900 dark:text-white">▹</span>
			<span className="leading-relaxed">{point}</span>
		</li>
	));

	return (
		<LazyMotion features={domAnimation}>
			<div
				ref={ref}
				style={{
					transform: isItemInView ? "none" : side === "right" ? "translateX(50px)" : "translateX(-50px)",
					opacity: isItemInView ? 1 : 0,
					transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.2 + index * 0.15}s`
				}}
				className={`relative text-sm w-full my-8 ${
					side === "right" ? "md:ml-auto" : "md:mr-auto"
				} md:w-5/12`}
			>
				{/* Card */}
				<div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
					<div className="mb-3">
						<span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
							{experience.date}
						</span>
					</div>

					<h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
						{experience.role}
					</h3>
					<h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
						{experience.company}
					</h4>

					<ul className="space-y-2 text-gray-700 dark:text-gray-300">{descriptionList}</ul>
				</div>
			</div>
		</LazyMotion>
	);
};

const VerticalTimeline = () => {
	return (
		<section id="timeline" className="section">
			<div className="container mx-auto">
				<HeadingDivider title="Work Experience" />
				<div className="pt-8 pb-16">
					<div className="relative w-full">
						{/* Simple timeline line */}
						<div className="hidden md:block absolute md:left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>

						{experiences.map((experience, index) => (
							<TimelineItem
								key={experience.id}
								experience={experience}
								index={index}
								side={index % 2 === 0 ? "left" : "right"}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default VerticalTimeline;
