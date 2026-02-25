"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SplitText } from "./SplitText";
import { useScrollTo } from "hooks";
import { useMediaQuery } from "utils";

const HeroScene = dynamic(() => import("./HeroScene").then((mod) => ({ default: mod.HeroScene })), {
	ssr: false,
	loading: () => <div className="w-full h-full" />
});

const orchestration = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.25, delayChildren: 0.3 }
	}
};

const fadeSlideUp = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.17, 0.55, 0.55, 1] }
	}
};

const scaleIn = {
	hidden: { opacity: 0, y: 50, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 1.0, ease: [0.17, 0.55, 0.55, 1] }
	}
};

const text = [
	"optimize business visibility",
	"create engaging user experiences",
	"develop headless Shopify apps",
	"convert design into modern UI",
	"build interactive UI using React",
	"develop websites using Next.js",
	"provide google presence",
	"drive digital growth strategies"
];

export function WelcomeSection() {
	const { scrollToEl } = useScrollTo();
	const isTabletUp = useMediaQuery("min-width: 768px");

	let [count, setCount] = useState(0);

	const onClick = (e) => scrollToEl(e);

	useEffect(() => {
		let interval = setInterval(() => {
			setCount((prev) => (prev === 7 ? 0 : prev + 1));
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<section id="intro" className="section">
			<motion.div
				className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr] lg:grid-cols-[1fr_0.7fr] gap-4 items-center"
				variants={orchestration}
				initial="hidden"
				animate="visible"
			>
				<div className="py-5 md:py-10">
					<motion.h1
						tabIndex="0"
						className="text-3xl md:text-5xl xl:text-6xl font-bold"
						variants={fadeSlideUp}
					>
						<SplitText delay={0.5}>
							Hi, I&apos;m <mark>Anthony</mark> a <mark>passionate</mark> software developer.
						</SplitText>
					</motion.h1>

					<motion.div
						className="mt-3 relative flex flex-col overflow-hidden"
						variants={fadeSlideUp}
					>
						<p className="text-[17px] md:text-2xl">
							I
							<span
								className="absolute flex flex-col transition-all duration-500 ease-in-expo"
								style={{
									top: `${count * -100}%`,
									left: "13px"
								}}
							>
								{text.map((element) => (
									<TextElement key={element} element={element} />
								))}
							</span>
						</p>
					</motion.div>

					<motion.p
						tabIndex="0"
						className="mt-3 mb-10 text-gray-500 text-xl"
						variants={fadeSlideUp}
					>
						Check out my latest projects!
					</motion.p>

					<motion.div variants={fadeSlideUp}>
						<Link
							href="#projects"
							onClick={onClick}
							tabIndex="0"
							className="btn"
							aria-label="Latest projects"
						>
							See my latest projects
						</Link>
					</motion.div>
				</div>

				{/* Headshot + 3D background */}
				<motion.div
					className="flex justify-center items-center mt-8 md:mt-0 relative"
					variants={scaleIn}
				>
					{/* Three.js scene */}
					<div className="absolute inset-0 flex justify-center items-center">
						<HeroScene
							isMobile={!isTabletUp}
							className="w-full h-full max-w-[500px] max-h-[500px]"
						/>
					</div>

					<div className="relative z-10">
						{/* Decorative background circle */}
						<div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 to-transparent rounded-full blur-xl scale-110"></div>

						{/* Main headshot container */}
						<div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
							<Image
								src="/headshot.jpg"
								alt="Anthony - Software Developer"
								width={320}
								height={320}
								className="w-full h-full object-cover object-center"
								priority
							/>

							{/* Subtle overlay for depth */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
						</div>

						{/* Floating accent elements */}
						<div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
						<div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-light rounded-full animate-pulse delay-1000"></div>
						<div className="absolute top-1/2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500"></div>
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
}

function TextElement({ element }) {
	const firstWord = <b>{element.split(" ").at(0)}</b>;
	const restWords = element.split(" ").slice(1).join(" ");

	return (
		<span className="text-[17px] md:text-2xl">
			{firstWord} {restWords}
		</span>
	);
}
