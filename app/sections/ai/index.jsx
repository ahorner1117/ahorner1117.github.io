"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { HeadingDivider } from "components";
import { useCursorGlow } from "hooks";

export function AISection() {
	const handleMouseMove = useCursorGlow();

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
			<section id="ai" className="section">
				<HeadingDivider title="AI-Assisted Development" />
				<p className="pcard-eyebrow">
					Human-led, <b>AI-accelerated</b>
				</p>

				<m.p
					className="ai-lead mt-10"
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
				>
					I leverage cutting-edge AI tools to accelerate development while maintaining{" "}
					<em>human-led architecture and decision-making</em>. My workflow combines specialized AI
					assistants with strategic prompt engineering to deliver exceptional results.
				</m.p>

				<ul className="panel-grid pb-16">
					{aiTools.map((group, index) => (
						<m.li
							key={group.title}
							className="panel"
							onMouseMove={handleMouseMove}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: (index % 2) * 0.08 }}
						>
							<span className="pcard-glow" aria-hidden="true" />
							<p className="panel-meta">
								<b>{String(index + 1).padStart(2, "0")}</b>
								<span>/ {String(aiTools.length).padStart(2, "0")}</span>
							</p>
							<h3 className="panel-title">{group.title}</h3>
							<ul className="xp-points">
								{group.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</m.li>
					))}
				</ul>
			</section>
		</LazyMotion>
	);
}
