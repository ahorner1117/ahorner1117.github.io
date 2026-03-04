import { AiFillHtml5, AiFillGithub, AiFillGitlab } from "react-icons/ai";
import { DiCss3, DiVisualstudio } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io";
import {
	FaReact,
	FaWordpressSimple,
	FaFigma,
	FaTrello,
	FaShopify,
	FaGit,
	FaSass
} from "react-icons/fa";
import { BsBootstrap } from "react-icons/bs";
import { TbBrandNextjs, TbBrandTailwind, TbPlugConnected } from "react-icons/tb";
import { SiOpenai, SiAnthropic, SiGithubcopilot } from "react-icons/si";
import AdobeXDIcon from "public/assets/svg/adobexd.svg";
import ZeplinIcon from "public/assets/svg/zeplin.svg";
import JiraIcon from "public/assets/svg/jira.svg";

import StyledIcon from "public/assets/svg/styledcomponents.svg";

export const TECHNOLOGIES = [
	{
		category: "Main Tech Stack",
		items: [
			/* Languages */
			{ name: "JS", icon: <IoLogoJavascript size={32} /> },
			{ name: "Typescript", icon: <i className="devicon-typescript-plain text-2xl" /> },
			{ name: "HTML", icon: <AiFillHtml5 size={32} /> },

			/* JS Frameworks */
			{ name: "React", icon: <FaReact size={32} /> },
			{ name: "Next.js", icon: <TbBrandNextjs size={32} /> },
			{ name: "Svelte", icon: <i className="devicon-svelte-plain text-2xl" /> },
			{ name: "React Native", icon: <FaReact size={32} /> },
			{ name: "jQuery", icon: <i className="devicon-jquery-plain text-2xl" /> },

			/* CSS / Styling */
			{ name: "CSS", icon: <DiCss3 size={32} /> },
			{ name: "SASS", icon: <FaSass size={32} /> },
			{ name: "Tailwind CSS", icon: <TbBrandTailwind size={32} /> },
			{ name: "Bootstrap", icon: <BsBootstrap size={32} /> },
			{ name: "Styled Components", icon: <StyledIcon width={32} /> },

			/* APIs */
			{ name: "GraphQL", icon: <i className="devicon-graphql-plain text-2xl" /> },

			/* Backend / Databases */
			{ name: "Supabase", icon: <i className="devicon-supabase-plain text-2xl" /> },
			{ name: "Firebase", icon: <i className="devicon-firebase-plain text-2xl" /> },
			{ name: "SQL", icon: <i className="devicon-azuresqldatabase-plain text-2xl" /> },
			{ name: "Docker", icon: <i className="devicon-docker-plain text-2xl"></i> },
		]
	},
	{
		category: "Secondary Tech Stack",
		items: [
			/* Languages */
			{ name: "PHP", icon: <i className="devicon-php-plain text-2xl" /> },
			{ name: "Java", icon: <i className="devicon-java-plain text-2xl" /> },
			{ name: "C#", icon: <i className="devicon-csharp-plain text-2xl" /> },
			{ name: "XML", icon: <i className="devicon-xml-plain text-2xl" /> },

			/* Backend / Databases */
			{ name: "Node.js", icon: <i className="devicon-nodejs-plain text-2xl" /> },
			{ name: "Express.js", icon: <i className="devicon-express-original text-2xl" /> },
			{ name: "SQL", icon: <i className="devicon-mysql-plain text-2xl" /> },
			{ name: "Posgresql", icon: <i className="devicon-postgresql-plain text-2xl" /> },
		]
	},
	{
		category: "UI tools",
		items: [
			{ name: "Figma", icon: <FaFigma size={32} /> },
			{ name: "Zeplin", icon: <ZeplinIcon width={36} /> },
			{ name: "XD", icon: <AdobeXDIcon width={32} /> },
			{ name: 'Gimp', icon: <i className="devicon-gimp-plain text-2xl" /> }
		]
	},
	{
		category: "Other tools",
		items: [
			/* Platforms */
			{ name: "WordPresss", icon: <FaWordpressSimple size={32} /> },
			{ name: "Shopify Plus", icon: <FaShopify size={32} /> },

			/* Version Control */
			{ name: "Git", icon: <FaGit size={32} /> },
			{ name: "Github", icon: <AiFillGithub size={32} /> },
			{ name: "Gitlab", icon: <AiFillGitlab size={32} /> },
			{ name: "Bitbucket", icon: <i className="devicon-bitbucket-original text-2xl" /> },

			/* Build / Package Managers */
			{ name: "Expo / EAS", icon: <i className="devicon-expo-original text-2xl" /> },
			{ name: "Babel", icon: <i className="devicon-babel-plain text-2xl" /> },
			{ name: "Vite", icon: <i className="devicon-vitejs-plain text-2xl" /> },
			{ name: "NPM", icon: <i className="devicon-npm-original-wordmark text-2xl" /> },
			{ name: "PNPM", icon: <i className="devicon-pnpm-plain text-2xl" /> },

			/* Project Management */
			{ name: "Jira", icon: <JiraIcon width={32} /> },
			{ name: "Trello", icon: <FaTrello size={32} /> },

			/* IDEs / Databases */
			{ name: "VsCode", icon: <DiVisualstudio size={32} /> },
			{ name: "Microsoft SQL Server", icon: <i className="devicon-microsoftsqlserver-plain text-2xl" /> },
		]
	},
	{
		category: "AI",
		items: [
			/* LLMs */
			{ name: "ChatGPT", icon: <SiOpenai size={32} /> },
			{ name: "Claude", icon: <SiAnthropic size={32} /> },

			/* AI Dev Tools */
			{ name: "GitHub Copilot", icon: <SiGithubcopilot size={32} /> },
			{ name: "Cursor", icon: <i className="devicon-cursor-plain text-2xl" /> },
			{ name: "Claude Code", icon: <SiAnthropic size={32} /> },
			{ name: "Hugging Face", icon: <i className="devicon-huggingface-plain text-2xl" /> },

			/* Protocols */
			{ name: "MCP", icon: <TbPlugConnected size={32} /> },
		]
	}
];
