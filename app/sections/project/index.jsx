import { ProjectCard } from "./ProjectCard";
import { ecommerce, projects } from "./data/projects";
import { HeadingDivider } from "components";

const GROUPS = [
	{ title: "E-Commerce Projects", eyebrow: "Storefronts shipped", category: "Commerce", items: ecommerce },
	{ title: "Projects & Websites", eyebrow: "Apps & sites built", category: "Product", items: projects }
];

export const ProjectsSection = () => {
	return (
		<section id="projects" className="section">
			{GROUPS.map((group, g) => (
				<div key={group.title} className={g > 0 ? "pt-20" : ""}>
					<HeadingDivider title={group.title} />
					<p className="pcard-eyebrow">
						{group.eyebrow} <b>{String(group.items.length).padStart(2, "0")}</b>
					</p>
					<div className="pcard-grid">
						{group.items.map((project, i) => (
							<ProjectCard
								key={project.title}
								project={project}
								index={i}
								total={group.items.length}
								category={group.category}
							/>
						))}
					</div>
				</div>
			))}
		</section>
	);
};
