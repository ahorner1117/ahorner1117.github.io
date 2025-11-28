"use client";

import { WelcomeSection, AboutSection, TechnologiesSection, ProjectsSection } from "app/sections";
import VerticalTimeline from "app/sections/timeline/timeline";
import { AISection } from "./sections/ai";

export default function Page() {
	return (
		<div className="container-md">
			<WelcomeSection />
			<AboutSection />
			<ProjectsSection />
			<VerticalTimeline />
			<AISection />
			<TechnologiesSection />
		</div>
	);
}
