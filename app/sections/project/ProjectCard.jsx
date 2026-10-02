import { LazyMotion, domAnimation, m } from "framer-motion";
import { useState } from "react";
import { FaShopify, FaGit, FaWordpress } from "react-icons/fa";
import Modal from "react-modal";
import { trackEvent } from "utils";
import { useCursorGlow } from "hooks";

const MAX_CARD_TOOLS = 3;

// Tool keys are devicon class names, except for a few react-icons components
const REACT_ICONS = { FaShopify, FaGit, FaWordpress };

function ToolIcon({ tool, className = "" }) {
	const Icon = REACT_ICONS[tool];
	return Icon ? <Icon className={className} /> : <i className={`${tool} ${className}`} />;
}

function ExternalIcon({ className = "w-3.5 h-3.5" }) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M9 7h8v8" />
		</svg>
	);
}

export const ProjectCard = ({ project, index = 0, total = 0, category = "" }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalOpenTime, setModalOpenTime] = useState(null);

	const tools = Object.keys(project.tools || {});
	const hiddenToolCount = tools.length - MAX_CARD_TOOLS;
	const num = String(index + 1).padStart(2, "0");
	const totalNum = String(total).padStart(2, "0");
	const logoClass = project.invertOnDark ? "dark:invert" : "";

	const openModal = () => {
		setIsModalOpen(true);
		setModalOpenTime(Date.now());
		trackEvent.projectModalOpen(project.title);
	};

	const closeModal = () => {
		setIsModalOpen(false);

		// Calculate and track time spent if modal was opened
		if (modalOpenTime) {
			const timeSpent = Math.round((Date.now() - modalOpenTime) / 1000);
			trackEvent.projectModalClose(project.title, timeSpent);
			setModalOpenTime(null);
		}
	};

	const handleCardClick = () => {
		trackEvent.projectCardClick(project.title, project.type || "general");
		openModal();
	};

	const handleKeyDown = (e) => {
		if (e.target !== e.currentTarget) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleCardClick();
		}
	};

	const handleMouseMove = useCursorGlow();

	const visitLinkProps = {
		href: project.link,
		target: "_blank",
		rel: "noopener noreferrer"
	};

	return (
		<>
			<LazyMotion features={domAnimation}>
				<m.article
					className="pcard"
					role="button"
					tabIndex={0}
					aria-label={`${project.title}: view project details`}
					onClick={handleCardClick}
					onKeyDown={handleKeyDown}
					onMouseMove={handleMouseMove}
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-60px" }}
					transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: (index % 3) * 0.08 }}
				>
					<span className="pcard-glow" aria-hidden="true" />
					<span className="pcard-corner tl" aria-hidden="true" />
					<span className="pcard-corner tr" aria-hidden="true" />
					<span className="pcard-corner bl" aria-hidden="true" />
					<span className="pcard-corner br" aria-hidden="true" />

					<header className="pcard-meta">
						<span className="pcard-num">
							<b>{num}</b>
							{total > 0 && ` / ${totalNum}`}
						</span>
						{category && <span className="pcard-cat">{category}</span>}
						<span className="pcard-arrow" aria-hidden="true">
							<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
							</svg>
						</span>
					</header>

					<div className="pcard-stage" data-stage={project.stage}>
						<img
							className={logoClass}
							src={project.imageUrl}
							alt={project.title}
							loading="lazy"
							decoding="async"
						/>
						{project.badge && <span className="pcard-badge">{project.badge}</span>}
					</div>

					<div className="pcard-body">
						<h3 className="pcard-title">{project.title}</h3>
						<p className="pcard-desc">{project.description}</p>
					</div>

					{tools.length > 0 && (
						<ul className="pcard-tools">
							{tools.slice(0, MAX_CARD_TOOLS).map((tool) => (
								<li key={tool} className="pcard-chip">
									<ToolIcon tool={tool} />
									{project.tools[tool]}
								</li>
							))}
							{hiddenToolCount > 0 && <li className="pcard-chip">+{hiddenToolCount}</li>}
						</ul>
					)}

					<footer className="pcard-foot">
						<span className="pcard-details">Details</span>
						<a
							{...visitLinkProps}
							className="pcard-visit"
							onClick={(e) => {
								e.stopPropagation();
								trackEvent.projectExternalLink(project.title, project.link);
							}}
						>
							Visit site
							<ExternalIcon />
						</a>
					</footer>
				</m.article>
			</LazyMotion>

			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				contentLabel="Project Details"
				className="Modal outline-none bg-[var(--pc-bg)] text-[var(--pc-text)] p-6 md:p-10 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--pc-line)]"
				overlayClassName="Overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-md z-50"
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{isModalOpen && (
					<LazyMotion features={domAnimation}>
						<m.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
						>
							{/* Header with close button */}
							<div className="flex justify-between items-start gap-4 mb-8">
								<div>
									<p className="pmodal-label mb-3">
										<span className="text-[var(--pc-accent)]">{num}</span>
										{category && ` — ${category}`}
										{project.badge && ` · ${project.badge}`}
									</p>
									<h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
										{project.title}
									</h2>
								</div>
								<button
									onClick={closeModal}
									aria-label="Close"
									className="shrink-0 p-3 rounded-full border border-[var(--pc-line)] text-[var(--pc-dim)] hover:text-[var(--pc-accent)] hover:border-[var(--pc-accent)] transition-colors"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							{/* Project Image */}
							<div className="pcard-stage pmodal-stage" data-stage={project.stage}>
								<img
									className={logoClass}
									src={project.imageUrl}
									alt={project.title}
									loading="lazy"
									decoding="async"
								/>
							</div>

							{/* Description */}
							<div className="mb-10">
								<h3 className="pmodal-label mb-3">About this project</h3>
								<p className="text-base md:text-lg leading-relaxed opacity-90">
									{project.description}
								</p>
							</div>

							{/* Tools Section */}
							{tools.length > 0 && (
								<div className="mb-10">
									<h3 className="pmodal-label mb-4">Technologies & Tools</h3>
									<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px p-px">
										{tools.map((tool) => (
											<li
												key={tool}
												className="flex items-center gap-3 p-4 bg-[var(--pc-chip)] outline outline-1 outline-[var(--pc-line)]"
											>
												<ToolIcon tool={tool} className="text-lg w-5 h-5" />
												<span className="text-sm font-semibold">{project.tools[tool]}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3">
								<a
									{...visitLinkProps}
									className="btn btn--split flex-1"
									onClick={() => trackEvent.projectExternalLink(project.title, project.link)}
								>
									<span className="btn-label">View Project</span>
									<span className="btn-icon btn-icon--external" aria-hidden="true">
										<ExternalIcon className="w-4 h-4" />
									</span>
								</a>
								<button onClick={closeModal} className="btn btn--ghost flex-1">
									Close
								</button>
							</div>
						</m.div>
					</LazyMotion>
				)}
			</Modal>
		</>
	);
};
