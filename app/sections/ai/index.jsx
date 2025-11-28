"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { HeadingDivider } from "components";

export function AISection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	const aiTools = [
		{
			title: "Core Tools & Environment",
			items: [
				"Cursor AI as primary IDE with integrated AI code completion and refactoring",
				"GitHub Copilot for CI/CD workflows",
				"Claude AI for planning, problem-solving, and complex implementation guidance",
				"Custom code rules for consistency across projects"
			]
		},
		{
			title: "Advanced AI Integration",
			items: [
				"MCP Server Integration: Figma, Stripe, and language-specific tools",
				"Prompt Engineering with RACE, CARE, and TAG frameworks",
				"Microsoft Copilot prompt generator for optimized AI interactions",
				"Custom servers from Hugging Face and Context7"
			]
		},
		{
			title: "Development Philosophy",
			items: [
				"Human-led development with AI acceleration",
				"Write and architect all core application logic independently",
				"AI accelerates implementation, not decision-making",
				"Critical code review and edge case identification",
				"Leverage AI for boilerplate generation with manual refinement"
			]
		},
		{
			title: "Business Impact",
			items: [
				"Transformed East Continental Gems from 0.02% to 900%+ conversion rate",
				"AI-assisted redesign and SEO improvements",
				"Advanced analytics integration",
				"Active monitoring of Hugging Face and research papers for emerging LLMs"
			]
		}
	];

	return (
		<LazyMotion features={domAnimation}>
			<section id="ai" className="section container">
				<HeadingDivider title="AI-Assisted Development" />



				<div className="pb-16 pt-8">
					<div
						tabIndex="0"
						className="text-md font-light leading-relaxed mb-8"
						style={{
							transform: isInView ? "none" : "translateX(-200px)",
							opacity: isInView ? 1 : 0,
							transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
						}}
					>
						<p className="text-xl mb-6 max-w-5xl">
							I leverage cutting-edge AI tools to accelerate development while maintaining human-led architecture and decision-making. My workflow combines specialized AI assistants with strategic prompt engineering to deliver exceptional results.
						</p>
					</div>

					<div className="flex justify-center my-0 mx-auto">
						<div
							ref={ref}
							className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl"
						>
							{aiTools.map((section, index) => (
								<div
									key={section.title}
									className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-gray-200 dark:border-gray-700"
									style={{
										transform: isInView ? "none" : "translateY(50px)",
										opacity: isInView ? 1 : 0,
										transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.2 + index * 0.1}s`
									}}
								>
									<h3 className="text-xl font-bold mb-4">
										{section.title}
									</h3>
									<ul className="space-y-3">
										{section.items.map((item, itemIndex) => (
											<li key={itemIndex} className="flex items-start">
												<span className="mr-2 mt-1">▹</span>
												<span className="text-sm leading-relaxed">{item}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</LazyMotion>
	);
}
