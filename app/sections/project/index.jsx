import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { ecommerce, projects } from "./data/projects";
import { HeadingDivider } from "components";

export const ProjectsSection = () => {
	const projectRef = useRef(null);
	const ecommRef = useRef(null);

	const isInView = useInView(projectRef, { once: true });
	const isEcommInView = useInView(ecommRef, { once: true });

	return (
		<section id="projects" className="section">
			<HeadingDivider title="E-Commerce Projects" />
			<div
				ref={projectRef}
				className="bg-transparent text-white pb-16"
				style={{
					transform: isInView ? "none" : "translateX(-200px)",
					opacity: isInView ? 1 : 0,
					transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
				}}
			>
				<LazyMotion features={domAnimation}>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
							{ecommerce.map((project) => (
								<ProjectCard key={project.title} project={project} />
							))}
						</div>
					</div>
				</LazyMotion>
				<LazyMotion features={domAnimation}>
					<div
						ref={ecommRef}
						style={{
							transform: isEcommInView ? "none" : "translateX(-200px)",
							opacity: isEcommInView ? 1 : 0,
							transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
						}}
					>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<h2 className="text-3xl font-extrabold tracking-tight text-center mb-10 mt-10">
								Projects & Websites
							</h2>
							<div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
								{projects.map((project) => (
									<ProjectCard key={project.title} project={project} />
								))}
							</div>
						</div>
					</div>
				</LazyMotion>
			</div>
		</section>
	);
};
