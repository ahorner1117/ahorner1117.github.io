import { LazyMotion, domAnimation } from "framer-motion";
import { useState } from "react";
import { FaShopify, FaGit, FaWordpress } from "react-icons/fa";
import Modal from "react-modal";

export const ProjectCard = ({ project }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const maxDescriptionLength = 250;

	const truncatedDescription =
		project.description.length > maxDescriptionLength
			? `${project.description.slice(0, maxDescriptionLength)}...`
			: project.description;

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const Tools = () => {
		return (
			<div className="flex items-center flex-col justify-center mt-2 mt-auto">
				<p className="text-xs align pr-2">Tools: </p>
				<div className="flex items-center pb-6">
					{project?.tools &&
						Object.keys(project.tools).map((tool, index) => {
							switch (tool) {
								case "FaShopify":
									return (
										<div className="mr-2 mt-2" key={index}>
											<FaShopify alt="Shopify" width={32} />
										</div>
									);
								case "FaGit":
									return (
										<div className="mr-2 mt-2" key={index}>
											<FaGit width={32} />
										</div>
									);
								case "FaWordpress":
									return (
										<div className="mr-2 mt-2" key={index}>
											<FaWordpress width={32} />
										</div>
									);
								default:
									return (
										<i key={index} className={`mr-2 mt-2 ${tool}`} title={project.tools[tool]} />
									);
							}
						})}
				</div>
			</div>
		);
	};

	return (
		<LazyMotion features={domAnimation}>
			<div
				onClick={openModal}
				className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-[#0a0a0a] border border-gray-600 cursor-pointer hover:border-gray-400 transition-all duration-300 hover:shadow-xl"
			>
				<img className="px-6 py-4 w-full h-48 object-contain" src={project.imageUrl} alt={project.title} />
				<div className="bg-transparent p-6 flex flex-col pw-bg">
					<div className="flex-1">
						<div className="block mt-2">
							<p className="text-xl font-semibold text-gray-300">{project.title}</p>
							<p className="mt-3 text-sm text-gray-300">
								{truncatedDescription}
								{project.description.length > maxDescriptionLength && (
									<span className="italics hover:underline" onClick={openModal}>
										{" "}
										read more
									</span>
								)}
							</p>
						</div>
					</div>
				</div>
				<Tools />
			</div>
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				contentLabel="Project Details"
				className="Modal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 md:p-8 rounded-xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-600"
				overlayClassName="Overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{isModalOpen && (
					<div className="modal-content">
						{/* Header with close button */}
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 pr-4">
								{project.title}
							</h2>
							<button 
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Project Image */}
						<div className="mb-6">
							<img
								className="w-full  md:h-64 object-cover rounded-lg shadow-md"
								src={project.imageUrl}
								alt={project.title}
							/>
						</div>

						{/* Description */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
								About this project
							</h3>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
								{project.description}
							</p>
						</div>

						{/* Tools Section */}
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
								Technologies & Tools
							</h3>
							<div className="flex flex-wrap gap-3">
								{project?.tools &&
									Object.keys(project.tools).map((tool, index) => {
										switch (tool) {
											case "FaShopify":
												return (
													<div 
														className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800" 
														key={index}
													>
														<FaShopify className="w-4 h-4" />
														<span className="text-sm font-medium">Shopify</span>
													</div>
												);
											case "FaGit":
												return (
													<div 
														className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg border border-orange-200 dark:border-orange-800" 
														key={index}
													>
														<FaGit className="w-4 h-4" />
														<span className="text-sm font-medium">Git</span>
													</div>
												);
											case "FaWordpress":
												return (
													<div 
														className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800" 
														key={index}
													>
														<FaWordpress className="w-4 h-4" />
														<span className="text-sm font-medium">WordPress</span>
													</div>
												);
											default:
												return (
													<div 
														className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600" 
														key={index}
													>
														<i className={`${tool} text-sm`} title={project.tools[tool]} />
														<span className="text-sm font-medium">{project.tools[tool]}</span>
													</div>
												);
										}
									})}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3">
							<a 
								href={project.link} 
								target="_blank" 
								rel="noopener noreferrer"
								className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center flex items-center justify-center gap-2"
							>
								<span>View Project</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
							<button 
								onClick={closeModal}
								className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Close
							</button>
						</div>
					</div>
				)}
			</Modal>
		</LazyMotion>
	);
};
