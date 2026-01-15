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
	const [isTechnical, setIsTechnical] = useState(false);

	const technicalContent = [
		"My name is Anthony Horner, a full-stack software engineer with over 7 years of experience in web development and e-commerce platforms. I hold a Bachelor's degree in Computer Science from Florida Atlantic University and have recently embraced AI-assisted development as a force multiplier for my engineering work.",

		"My stack spans JavaScript, TypeScript, React, Next.js, Svelte, SvelteKit, TailwindCSS, GraphQL, Node.js, Express, and cloud platforms including Firebase, Vercel, and Azure. I specialize in Shopify/Shopify Plus development, headless commerce architecture, API design, IoT integration, and CI/CD workflows with Docker.",

		"In 2024-2025, I evolved my development practice to leverage cutting-edge AI tooling including Cursor IDE with Claude AI, GitHub Copilot for CI/CD workflows, and specialized MCP servers for Figma, Stripe, Context7, Hugging Face, Shopify, Next.js, Svelte, and Tailwind. I apply advanced prompt engineering frameworks (RACE, CARE, TAG) while maintaining full control over architecture decisions and critically reviewing all AI-generated code to ensure production standards.",

		"At Macro Exotics, I built a peer-to-peer exotic vehicle rental platform using AI-accelerated development techniques. Built with Svelte 5, SvelteKit, Firebase, and Stripe, the platform features secure authentication, real-time availability tracking, instant booking, payment processing, and professional driver delivery. I leveraged Claude AI for architecture validation and planning, Firebase MCP for streamlined database operations, integrated Google Gemini AI for automated listing descriptions and image analysis (damage detection, quality assurance), and connected multiple specialized LLMs for fraud detection, pricing recommendations, and content moderation—creating a cost-efficient multi-model AI ecosystem.",

		"Over the past 3+ years, I've engineered multiple Next.js and React e-commerce stores on Shopify Plus for FIFA, Madison Square Garden, Real Madrid, the Chicago Bulls, USA Olympic Hockey, and Century 21. My current workflow connects Figma MCP to Cursor AI, enabling direct conversion of design files into pixel-perfect, production-ready interfaces. I've implemented headless architecture with Contentful CMS using GraphQL, built custom Shopify apps leveraging Admin API and Storefront API (subscription management, dynamic discount systems), and streamlined deployment with Docker, Bitbucket, and Azure DevOps.",

		"My background includes Node.js microservices and IoT integrations for manufacturing and industrial sectors (real-time data collection systems, health dashboards), custom WordPress plugin development (PHP), augmented reality QR code generators (JavaScript), cross-domain Shopify cart sync systems (JavaScript/jQuery), and Shopify Theme 2.0 landing pages with drag-and-drop editing.",

		"I've also built Java/Maven/Selenium automation tools that process CSV phone records and update CRM systems via REST APIs, designed company-wide HTML/CSS email signature systems, and automated affiliate reimbursement programs that saved over $70,000 annually."
	];
	
	const nonTechnicalContent = [
		"My name is Anthony Horner. I’m a passionate problem-solver and full-stack software engineer with over 7 years of experience helping businesses grow through innovative digital solutions, holding a Bachelor’s degree in Computer Science from Florida Atlantic University.",
		"I create high-performance, visually stunning websites and digital platforms that engage customers and make it easier for businesses to manage their online presence.",
		"One of my biggest projects is Macro Exotics – a luxury and exotic car rental platform that connects renters with owners in a safe, trusted, and seamless way. I designed and built it from the ground up, handling everything from account creation and bookings to secure payments and professional vehicle delivery.",
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
					className="flex justify-center mt-2"
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
							Technical Details
						</button>
						<button
							onClick={() => setIsTechnical(false)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
								!isTechnical
									? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							Simple Overview
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
