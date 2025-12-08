import { LazyMotion, domAnimation, motion } from "framer-motion";
import { useState } from "react";
import { FaShopify, FaGit, FaWordpress } from "react-icons/fa";
import Modal from "react-modal";
import { trackEvent } from "utils";

export const ProjectCard = ({ project }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalOpenTime, setModalOpenTime] = useState(null);
	const maxDescriptionLength = 250;

	const truncatedDescription =
		project.description.length > maxDescriptionLength
			? `${project.description.slice(0, maxDescriptionLength)}...`
			: project.description;

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

	const Tools = () => {
		return (
			<div className="px-6 pb-6 pt-2">
				<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
					<p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mb-3 text-center">Technologies</p>
					<div className="flex flex-wrap items-center justify-center gap-2">
						{project?.tools &&
							Object.keys(project.tools).map((tool, index) => {
								switch (tool) {
									case "FaShopify":
										return (
											<div 
												className="p-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg" 
												key={index}
											>
												<FaShopify className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
											</div>
										);
									case "FaGit":
										return (
											<div 
												className="p-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg" 
												key={index}
											>
												<FaGit className="w-4 h-4 text-orange-700 dark:text-orange-300" />
											</div>
										);
									case "FaWordpress":
										return (
											<div 
												className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg" 
												key={index}
											>
												<FaWordpress className="w-4 h-4 text-blue-700 dark:text-blue-300" />
											</div>
										);
									default:
										return (
											<div 
												className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg" 
												key={index}
												title={project.tools[tool]}
											>
												<i className={`${tool} text-sm text-gray-700 dark:text-gray-300`} />
											</div>
										);
								}
							})}
					</div>
				</div>
			</div>
		);
	};

	const handleCardClick = () => {
		trackEvent.projectCardClick(project.title, project.type || 'general');
		openModal();
	};

	return (
		<LazyMotion features={domAnimation}>
			<motion.div
				onClick={handleCardClick}
				className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
				whileHover={{ scale: 1.02 }}
				transition={{ duration: 0.2 }}
			>
				{/* Image container with better contrast handling */}
				<div className="bg-slate-300 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
					<img
						className="w-full h-48 object-contain p-6"
						src={project.imageUrl}
						alt={project.title}
						loading="lazy"
						decoding="async"
					/>
				</div>
				
				<div className="p-6 flex flex-col flex-1">
					<div className="flex-1">
						<div className="mb-4">
							<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
								{project.title}
							</h3>
							<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
								{truncatedDescription}
								{project.description.length > maxDescriptionLength && (
									<span 
										className="inline-block ml-1 text-blue-600 dark:text-blue-400 font-semibold cursor-pointer" 
										onClick={openModal}
									>
										read more →
									</span>
								)}
							</p>
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
								onClick={(e) => {
									e.stopPropagation();
									trackEvent.projectExternalLink(project.title, project.link);
								}}
							>
								<span>Visit Site</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
						</div>
					</div>
				</div>
				<Tools />
			</motion.div>

			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				contentLabel="Project Details"
				className="Modal bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8 rounded-3xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
				overlayClassName="Overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-md z-50"
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{isModalOpen && (
					<motion.div 
						className="modal-content"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{/* Header with close button */}
						<div className="flex justify-between items-start mb-8">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 pr-4">
								{project.title}
							</h2>
							<motion.button 
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
								whileHover={{ scale: 1.1, rotate: 90 }}
								transition={{ duration: 0.2 }}
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</motion.button>
						</div>

						{/* Project Image */}
						<div className="mb-8">
							<div className="rounded-2xl overflow-hidden shadow-lg bg-slate-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
								<motion.img
									className="w-full h-80 object-contain p-6"
									src={project.imageUrl}
									alt={project.title}
									loading="lazy"
									decoding="async"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, delay: 0.1 }}
								/>
							</div>
						</div>

						{/* Description */}
						<div className="mb-8">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
								<span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></span>
								About this project
							</h3>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
								{project.description}
							</p>
						</div>

						{/* Tools Section */}
						<div className="mb-10">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
								<span className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 mr-3"></span>
								Technologies & Tools
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{project?.tools &&
									Object.keys(project.tools).map((tool, index) => {
										switch (tool) {
											case "FaShopify":
												return (
													<div 
														className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-700" 
														key={index}
													>
														<FaShopify className="w-5 h-5" />
														<span className="text-sm font-semibold">Shopify</span>
													</div>
												);
											case "FaGit":
												return (
													<div 
														className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl border border-orange-200 dark:border-orange-700" 
														key={index}
													>
														<FaGit className="w-5 h-5" />
														<span className="text-sm font-semibold">Git</span>
													</div>
												);
											case "FaWordpress":
												return (
													<div 
														className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-700" 
														key={index}
													>
														<FaWordpress className="w-5 h-5" />
														<span className="text-sm font-semibold">WordPress</span>
													</div>
												);
											default:
												return (
													<div 
														className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600" 
														key={index}
													>
														<i className={`${tool} text-lg`} title={project.tools[tool]} />
														<span className="text-sm font-semibold">{project.tools[tool]}</span>
													</div>
												);
										}
									})}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<a
								href={project.link}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-300 text-center flex items-center justify-center gap-3"
								onClick={() => trackEvent.projectExternalLink(project.title, project.link)}
							>
								<span>View Project</span>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
							<button 
								onClick={closeModal}
								className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-xl transition-colors duration-300 border border-gray-200 dark:border-gray-600"
							>
								Close
							</button>
						</div>
					</motion.div>
				)}
			</Modal>
		</LazyMotion>
	);
};
