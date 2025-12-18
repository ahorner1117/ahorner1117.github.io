"use client";

import dynamic from 'next/dynamic';
import { WelcomeSection } from "app/sections";

// Lazy load sections with dynamic imports for better performance
// WelcomeSection is loaded immediately as it's above the fold
const AboutSection = dynamic(() => import("app/sections").then(mod => ({ default: mod.AboutSection })), {
	loading: () => <SectionLoader />,
});

const ProjectsSection = dynamic(() => import("app/sections").then(mod => ({ default: mod.ProjectsSection })), {
	loading: () => <SectionLoader />,
});

const VerticalTimeline = dynamic(() => import("app/sections/timeline/timeline"), {
	loading: () => <SectionLoader />,
});

const AISection = dynamic(() => import("./sections/ai").then(mod => ({ default: mod.AISection })), {
	loading: () => <SectionLoader />,
});

const TechnologiesSection = dynamic(() => import("app/sections").then(mod => ({ default: mod.TechnologiesSection })), {
	loading: () => <SectionLoader />,
});

// Simple loading component for sections
function SectionLoader() {
	return (
		<div className="section flex items-center justify-center min-h-[200px]">
			<div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
		</div>
	);
}

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
