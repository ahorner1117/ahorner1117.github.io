"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { WelcomeAnimation } from "./IntroAnimation";
import { useMediaQuery } from "utils";

function FallingButton() {
	const buttonRef = useRef(null);
	const messageRef = useRef(null);
	const [isAnimating, setIsAnimating] = useState(false);
	const [message, setMessage] = useState("");
	const animationRef = useRef(null);

	const handleClick = useCallback((e) => {
		e.preventDefault();

		if (isAnimating) {
			return;
		}

		// Start the falling animation
		setIsAnimating(true);
		const button = buttonRef.current;

		if (!button) return;

		button.style.transformOrigin = "0% 0%";

		const anim = button.animate(
			[
				{ transform: "translateY(10px) rotate(0deg)" },
				{ transform: "translateY(20px) rotate(5deg)" },
				{ transform: "translateY(40px) rotate(20deg)" },
				{ transform: "translateY(140px) rotate(50deg)" },
				{ transform: "translateY(100vh) rotate(95deg)" }
			],
			{
				duration: 900,
				easing: "cubic-bezier(.25,.9,.4,1)",
				fill: "forwards"
			}
		);

		animationRef.current = anim;

		const msgChars = "Ohhhh no it broke again".split("");
		anim.addEventListener("finish", () => {
			let i = 0;

			// TYPE
			const typeInterval = setInterval(() => {
				if (i > msgChars.length) {
					clearInterval(typeInterval);

					// wait 4s then erase
					setTimeout(() => {
						const eraseInterval = setInterval(() => {
							setMessage(prev => {
								const chars = prev.split("");
								chars.pop();
								if (chars.length === 0) {
									clearInterval(eraseInterval);
									// Reverse animation
									anim.playbackRate = -1;
									anim.play();

									anim.addEventListener("finish", () => {
										// Small delay before showing button again
										setTimeout(() => {
											setIsAnimating(false);
											setMessage("");
											button.style.transform = "";
										}, 400);
									}, { once: true });
								}
								return chars.join("");
							});
						}, 40);
					}, 6000);
				} else {
					setMessage(prev => {
						const chars = prev.split("");
						chars.push(msgChars[i]);
						return chars.join("");
					});
					i++;
				}
			}, 40);
		}, { once: true });
	}, [isAnimating]);

	return (
		<div className="relative inline-block">
			<Link
				ref={buttonRef}
				href="#projects"
				onClick={handleClick}
				tabIndex="0"
				className="btn relative"
				aria-label="Latest projects"
				style={{
					transformOrigin: "top left",
					cursor: "pointer"
				}}
			>
				See my latest projects
			</Link>
			{isAnimating && (
				<div
					ref={messageRef}
					className="absolute top-0 left-0 text-white text-2xl select-none whitespace-nowrap"
				>
					{message}
				</div>
			)}
		</div>
	);
}

export function WelcomeSection() {
	const ref = useRef(null);
	const introRef = useRef(null);
	const headshotRef = useRef(null);
	const isInView = useInView(ref, { once: true });
	const isHeadshotInView = useInView(headshotRef, { once: true });
	const isTabletUp = useMediaQuery("min-width: 768px");

	let [count, setCount] = useState(0);
	const [text] = useState([
		"optimize business visibility",
		"create engaging user experiences",
		"develop headless Shopify apps",
		"convert design into modern UI",
		"build interactive UI using React",
		"develop websites using Next.js",
		"provide google presence",
		"drive digital growth strategies"
	]);

	useEffect(() => {
		let interval = setInterval(() => {
			setCount(count + 1);

			if (count === 7) {
				setCount(0);
			}
		}, 2000);

		return () => clearInterval(interval);
	}, [count]);

	return (
		<LazyMotion features={domAnimation}>
			<section id="intro" className="section" ref={introRef}>
				<div className=" grid grid-cols-1 md:grid-cols-[1fr_0.5fr] lg:grid-cols-[1fr_0.7fr] gap-4 items-center">
					<div className="py-5 md:py-10">
						<h1
							tabIndex="0"
							ref={ref}
							className="text-3xl md:text-5xl xl:text-6xl font-bold"
							style={{
								transform: isInView ? "none" : "translateX(-200px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
							}}
						>
							<p>
								Hi, I&apos;m <mark>Anthony</mark> a <mark>passionate</mark> software developer.
							</p>
						</h1>

						<div className="mt-3 relative flex flex-col overflow-hidden">
							<p
								ref={ref}
								className="text-[17px] md:text-2xl transform-none opacity-100"
								style={{
									transform: isInView ? "none" : "translateX(-200px)",
									opacity: isInView ? 1 : 0,
									transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
								}}
							>
								I
								<span
									className="absolute flex flex-col transition-all duration-500 ease-in-expo"
									style={{
										top:
											count === 0
												? "0"
												: count === 1
													? "-100%"
													: count === 2
														? "-200%"
														: count === 3
															? "-300%"
															: count === 4
																? "-400%"
																: count === 5
																	? "-500%"
																	: count === 6
																		? "-600%"
																		: count === 7
																			? "-700%"
																			: "0",
										left: "13px"
									}}
								>
									{text.map((element) => (
										<TextElement key={element} element={element} />
									))}
								</span>
							</p>
						</div>

						<p
							tabIndex="0"
							ref={ref}
							className="mt-3 mb-10 text-gray-500 text-xl"
							style={{
								transform: isInView ? "none" : "translateX(-200px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
							}}
						>
							Check out my latest projects!
						</p>
						<div
							ref={ref}
							style={{
								transform: isInView ? "none" : "translateY(50px)",
								opacity: isInView ? 1 : 0,
								transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
							}}
						>
							<FallingButton />
						</div>
					</div>

					{/* Headshot section - visible on all screen sizes */}
					<div
						ref={headshotRef}
						className="flex justify-center items-center mt-8 md:mt-0 relative"
						style={{
							transform: isHeadshotInView ? "none" : "translateY(50px) scale(0.9)",
							opacity: isHeadshotInView ? 1 : 0,
							transition: "all 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"
						}}
					>
						{/* Background animation */}
						<div className="absolute inset-0 flex justify-center items-center">
							<div className="translate-y-[-80px] w-full h-full max-w-[500px] max-h-[500px] opacity-30">
								<WelcomeAnimation />
							</div>
						</div>

						<div className="relative z-10">
							{/* Decorative background circle */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl scale-110"></div>

							{/* Main headshot container */}
							<div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
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
							<div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
							<div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
							<div className="absolute top-1/2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500"></div>
						</div>
					</div>
				</div>
			</section>
		</LazyMotion>
	);
}

function TextElement({ element }) {
	const firstWord = <b>{element.split(" ").at(0)}</b>;
	const restWords = element.split(" ").slice(1).join(" ");
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<span
			tabIndex="0"
			ref={ref}
			className="text-[17px] md:text-2xl"
			style={{
				transform: isInView ? "none" : "translateX(-200px)",
				opacity: isInView ? 1 : 0,
				transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
			}}
		>
			{firstWord} {restWords}
		</span>
	);
}
