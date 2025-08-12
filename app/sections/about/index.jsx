"use client";

import { useRef, useState } from "react";
import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { HeadingDivider } from "components";
import { TimeLine } from "./TimeLine";

export function AboutSection() {
	const ref = useRef(null);
	const toggleRef = useRef(null);
	const isInView = useInView(ref, { once: true });
	const isToggleInView = useInView(toggleRef, { once: true });
	const [isTechnical, setIsTechnical] = useState(true);

	const technicalContent = [
		"My name is Anthony Horner, a seasoned full-stack software engineer with over 7 years of experience and a Bachelor’s degree in Computer Science from Florida Atlantic University.",
		"I specialize in a broad spectrum of web technologies including JavaScript, TypeScript, React, Next.js, Svelte, TailwindCSS, GraphQL, Shopify, API development, and cloud platforms such as Firebase and Vercel.",
		"One of my signature achievements is Macro Exotics, a premium vehicle rental platform similar to Airbnb but specializing in exotic and luxury cars. Built with Svelte, SvelteKit, TailwindCSS, and Firebase, it includes secure authentication, instant booking, availability management, Stripe payments, and professional driver delivery.",
		"My e-commerce portfolio includes high-profile Shopify Plus projects for FIFA, Madison Square Garden, Real Madrid, the Chicago Bulls, USA Olympic Hockey, and Century 21. In these projects I transformed Figma designs into responsive, dynamic storefronts, implemented headless architecture with Next.js, created custom checkout apps, and built employee discount systems leveraging the Shopify Admin API and Storefront API.",
		"I have also developed microservices and IoT integrations on Node.js frameworks, creating systems for real-time data collection, health dashboards, and multi-device communication.",
		"My diverse experience covers custom WordPress plugin development in PHP, augmented reality QR code generators in JavaScript, and cross-domain Shopify cart sync systems with JavaScript and jQuery. I’ve also created Theme 2.0 Shopify landing pages with drag-and-drop editing for easy admin customization.",
		"Additionally, I engineered a Java/Maven/Selenium automation that processes CSV-based phone records, calls a CRM via REST APIs to update deal stages, and I designed HTML/CSS email signatures for company-wide branding consistency."
	];
	
	const nonTechnicalContent = [
		"My name is Anthony Horner. I’m a passionate problem-solver and full-stack software engineer with over 7 years of experience helping businesses grow through innovative digital solutions, holding a Bachelor’s degree in Computer Science from Florida Atlantic University.",
		"I create high-performance, visually stunning websites and digital platforms that engage customers and make it easier for businesses to manage their online presence.",
		"One of my proudest accomplishments is Macro Exotics – a luxury and exotic car rental platform that connects renters with owners in a safe, trusted, and seamless way. I designed and built it from the ground up, handling everything from account creation and bookings to secure payments and professional vehicle delivery.",
		"I’ve helped major brands launch e-commerce stores that are fast, secure, and easy to maintain. For store owners, I create admin-friendly tools that eliminate the need for coding while keeping designs pixel-perfect and on brand.",
		"I’ve also built systems that help organizations make smarter decisions by tracking and visualizing real-time data from different sources — including integrations that connect directly to devices and cloud systems.",
		"My work includes creating user-friendly features like interactive elements, custom integrations, and content management systems so that non-technical teams can update their websites quickly and effortlessly.",
		"Beyond websites, I’ve built automation tools that save businesses time and money — from systems that process and update customer records automatically, to professional branding tools like unified company email signatures."
	];
	const currentContent = isTechnical ? technicalContent : nonTechnicalContent;

	return (
		<LazyMotion features={domAnimation}>
			<section id="about" className="section">
				<HeadingDivider title="About me" />
				
				{/* Toggle Button */}
				<div 
					ref={toggleRef}
					className="flex justify-center mb-6"
					style={{
						transform: isToggleInView ? "none" : "translateY(-50px)",
						opacity: isToggleInView ? 1 : 0,
						transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s"
					}}
				>
					<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
						<button
							onClick={() => setIsTechnical(true)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
								isTechnical
									? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							For Recruiters
						</button>
						<button
							onClick={() => setIsTechnical(false)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
								!isTechnical
									? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							For Everyone
						</button>
					</div>
				</div>

				<div className="pt-4 pb-16 max-w-5xl flex flex-col gap-3">
					<div
						tabIndex="0"
						ref={ref}
						className="text-md font-light leading-relaxed"
						style={{
							transform: isInView ? "none" : "translateX(-200px)",
							opacity: isInView ? 1 : 0,
							transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
						}}
					>
						{currentContent.map((paragraph, index) => (
							<p key={index} className="my-3.5">
								{paragraph}
							</p>
						))}
					</div>
				</div>

				<TimeLine />
			</section>
		</LazyMotion>
	);
}
