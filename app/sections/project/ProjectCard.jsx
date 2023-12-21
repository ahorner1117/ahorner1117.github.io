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
                    <FaShopify width={32} />
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
    )
  }

	return (
		<LazyMotion features={domAnimation}>
			<div
				onClick={openModal}
				className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-[#0a0a0a] border border-gray-600 cursor-pointer"
			>
				<img className="w-full h-48 object-contain" src={project.imageUrl} alt={project.title} />
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
{/* 				<div className="flex items-center flex-col justify-center mt-2 mt-auto">
					<p className="text-xs align pr-2">Tools: </p>
					<div className="flex items-center pb-6">
						{project?.tools &&
							Object.keys(project.tools).map((tool, index) => {
								switch (tool) {
									case "FaShopify":
										return (
											<div className="mr-2 mt-2" key={index}>
												<FaShopify width={32} />
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
				</div> */}
			</div>
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				contentLabel="Project Details"
				className="Modal bg-gray-300 text-black p-8 rounded-md w-full md:w-1/2 shadow-lg mt-10"
				overlayClassName="Overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
				shouldCloseOnOverlayClick={true}
				ariaHideApp={false}
			>
				{isModalOpen && (
					<div className="modal-content text-left">
						<img
							className="w-full h-48 object-contain mb-4"
							src={project.imageUrl}
							alt={project.title}
						/>
						<h2 className="text-2xl font-bold mb-2">{project.title}</h2>
						<p className="text-sm mb-4">{project.description}</p>
            <Tools />

						<div className="flex justify-between items-center">
							<button className="btn">
								<a href={project.link} target="_blank">
									View Project ↗️
								</a>
							</button>

							<button className="btn" onClick={closeModal}>
								Close Modal
							</button>
						</div>
					</div>
				)}
			</Modal>
		</LazyMotion>
	);
};
