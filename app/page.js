"use client";

import { WelcomeSection, AboutSection, TechnologiesSection, ProjectsSection, AISection } from "app/sections";
import VerticalTimeline from "app/sections/timeline/timeline";

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
