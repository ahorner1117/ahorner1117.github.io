import { domAnimation, LazyMotion, m } from "framer-motion";
import { useState } from "react";
import { HeadingDivider } from "components";
import { useCursorGlow } from "hooks";

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

const VISIBLE_POINTS = 3;

// "MM.YYYY" -> months since year 0; "Present" -> now
function toMonths(value) {
	if (/present/i.test(value)) {
		const now = new Date();
		return now.getFullYear() * 12 + now.getMonth() + 1;
	}
	const [month, year] = value.split(".").map(Number);
	return year * 12 + month;
}

function formatTenure(date) {
	const [start, end] = date.split("-").map((part) => part.trim());
	const months = Math.max(1, toMonths(end) - toMonths(start));
	const years = Math.floor(months / 12);
	const rest = months % 12;
	return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`]
		.filter(Boolean)
		.join(" ");
}

const TimelineItem = ({ experience, index, total }) => {
	const [expanded, setExpanded] = useState(false);
	const [start, end] = experience.date.split("-").map((part) => part.trim());
	const isCurrent = /present/i.test(end);
	const points = expanded ? experience.description : experience.description.slice(0, VISIBLE_POINTS);
	const hiddenCount = experience.description.length - VISIBLE_POINTS;

	const handleMouseMove = useCursorGlow();

	return (
		<m.li
			className="xp-row"
			onMouseMove={handleMouseMove}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.05 }}
		>
			<span className="pcard-glow" aria-hidden="true" />

			<div className="xp-when">
				<span className="xp-num">
					<b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
				</span>
				<span className="xp-dates">
					{start} — {isCurrent ? <em>Present</em> : end}
				</span>
				<span className="xp-tenure">{formatTenure(experience.date)}</span>
			</div>

			<span className={`xp-node ${isCurrent ? "is-current" : ""}`} aria-hidden="true" />

			<div className="xp-body">
				<h3 className="xp-role">{experience.role}</h3>
				<p className="xp-company">
					<span>@</span> {experience.company}
				</p>
				<ul className="xp-points">
					{points.map((point, idx) => (
						<li key={idx}>{point}</li>
					))}
				</ul>
				{hiddenCount > 0 && (
					<button
						type="button"
						className="xp-toggle"
						aria-expanded={expanded}
						onClick={() => setExpanded((open) => !open)}
					>
						{expanded ? "Show less" : `Show all ${experience.description.length}`}
						<span aria-hidden="true">{expanded ? "−" : "+"}</span>
					</button>
				)}
			</div>
		</m.li>
	);
};

const VerticalTimeline = () => {
	return (
		<section id="timeline" className="section">
			<HeadingDivider title="Work Experience" />
			<p className="pcard-eyebrow">
				Roles held <b>{String(experiences.length).padStart(2, "0")}</b>
			</p>
			<LazyMotion features={domAnimation}>
				<ol className="xp-list">
					{experiences.map((experience, index) => (
						<TimelineItem
							key={experience.id}
							experience={experience}
							index={index}
							total={experiences.length}
						/>
					))}
				</ol>
			</LazyMotion>
		</section>
	);
};

export default VerticalTimeline;
