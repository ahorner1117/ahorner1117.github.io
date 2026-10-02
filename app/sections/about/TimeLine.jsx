"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

const TimeLineData = [
	{ year: 2019, text: "Software Development internship as a database specialist" },
	{ year: 2020, text: "Java developer, customizing backend CRM solutions" },
	{ year: 2021, text: "Front End Developer, specializing in Next.js and React" },
	{ year: 2022, text: "Application Engineer / Cloud Developer - Node.js in the IOT industry" },
	{ year: 2023, text: "Front End Developer, specializing in Next.js, React, and GraphQL" },
	{ year: 2024, text: "Full Stack Developer, Next.js, Node.js, Shopify, and React" },
	{ year: 2025, text: "Full Stack Developer, AI adaption with Svelte, Firebase, Node.js" },
];

export function TimeLine() {
	return (
		<LazyMotion features={domAnimation}>
			<ol className="years hide-scroll-bar" aria-label="Career by year">
				{TimeLineData.map((item, index) => (
					<m.li
						key={item.year}
						tabIndex={0}
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.06 }}
					>
						<h3 className="years-year">{item.year}</h3>
						<p className="years-text">{item.text}</p>
					</m.li>
				))}
			</ol>
		</LazyMotion>
	);
}
