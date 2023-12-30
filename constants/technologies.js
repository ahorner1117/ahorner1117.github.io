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
import { TbBrandNextjs, TbBrandTailwind } from "react-icons/tb";
import AdobeXDIcon from "public/assets/svg/adobexd.svg";
import ZeplinIcon from "public/assets/svg/zeplin.svg";
import JiraIcon from "public/assets/svg/jira.svg";

import StyledIcon from "public/assets/svg/styledcomponents.svg";

export const TECHNOLOGIES = [
	{
		category: "Main Tech Stack",
		items: [
			{ name: "React", icon: <FaReact size={32} /> },
			{ name: "Next", icon: <TbBrandNextjs size={32} /> },
			{ name: "Typescript", icon: <i className="devicon-typescript-plain text-2xl" /> },
			{ name: "HTML", icon: <AiFillHtml5 size={32} /> },
			{ name: "CSS", icon: <DiCss3 size={32} /> },
			{ name: "SASS", icon: <FaSass size={32} /> },
			{ name: "JS", icon: <IoLogoJavascript size={32} /> },
			{ name: "jQuery", icon: <i className="devicon-jquery-plain text-2xl" /> },
			{ name: "Tailwind CSS", icon: <TbBrandTailwind size={32} /> },
			{ name: "Bootstrap", icon: <BsBootstrap size={32} /> },
			{ name: "Styled Components", icon: <StyledIcon width={32} /> },
			{ name: "GraphQL", icon: <i className="devicon-graphql-plain text-2xl" /> }
		]
	},
	{
		category: "Secondary Tech Stack",
		items: [
			{ name: "PHP", icon: <i className="devicon-php-plain text-2xl"/> },
			{ name: "Java", icon: <i className="devicon-java-plain text-2xl"/> },
			{ name: "SQL", icon: <i className="devicon-mysql-plain text-2xl" /> },
			{ name: "Node.js", icon: <i className="devicon-nodejs-plain text-2xl" /> },
			{ name: "Express.js", icon: <i className="devicon-express-original text-2xl" /> },
			{ name: "Posgresql", icon: <i className="devicon-postgresql-plain text-2xl" /> },
		]
	},
	{
		category: "UI tools",
		items: [
			{ name: "Figma", icon: <FaFigma size={32} /> },
			{ name: "Zeplin", icon: <ZeplinIcon width={36} /> },
			{ name: "XD", icon: <AdobeXDIcon width={32} /> },
			{ name: 'Gimp', icon: <i className="devicon-gimp-plain text-2xl" />}
		]
	},
	{
		category: "Other tools",
		items: [
			{ name: "WordPresss", icon: <FaWordpressSimple size={32} /> },
			{ name: "Shopify Plus", icon: <FaShopify size={32} /> },
			{ name: "Jira", icon: <JiraIcon width={32} /> },
			{ name: "Git", icon: <FaGit size={32} /> },
			{ name: "Trello", icon: <FaTrello size={32} /> },
			{ name: "Github", icon: <AiFillGithub size={32} /> },
			{ name: "Gitlab", icon: <AiFillGitlab size={32} /> },
			{ name: "VsCode", icon: <DiVisualstudio size={32} /> },
			{ name: "Microsoft SQL Server", icon: <i className="devicon-microsoftsqlserver-plain text-2xl" /> },
			{ name: "Bitbucket", icon: <i className="devicon-bitbucket-original text-2xl" /> },
		]
	}
];
