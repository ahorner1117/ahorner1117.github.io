import { FaShopify, FaGit, FaWordpress } from "react-icons/fa";


export const ProjectCard = ({ project }) => {
    return (
      <div key={project.title} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-[#0a0a0a] border border-gray-600">
        <a href={project?.link} target="_blank" className="block">
          <img
            className="w-full h-48 object-contain"
            src={project.imageUrl}
            alt={project.title}
          />
        </a>
        <a href={project?.link} target="_blank" className="block">
          <div className="bg-transparent p-6 flex flex-col pw-bg">
            <div className="flex-1">
                <div className="block mt-2">
                  <p className="text-xl font-semibold text-gray-300">{project.title}</p>
                  <p className="mt-3 text-sm text-gray-300">{project.description}</p>
                </div>
            </div>
          </div>
        </a>
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
                      <i
                        key={index}
                        className={`mr-2 mt-2 ${tool}`}
                        title={project.tools[tool]}
                      />
                    );
                }
              })}
          </div>
        </div>
      </div>
    );
  };