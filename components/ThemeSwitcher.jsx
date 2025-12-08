"use client";

import { useTheme } from "next-themes";
import { BsMoon, BsSun } from "react-icons/bs";
import { useEffect, useState } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { animate, exit, initial, transition, trackEvent } from "utils";

export const ThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, systemTheme } = useTheme();

	const currentTheme = theme === "system" ? systemTheme : theme;

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return null;
	}

	return (
		<LazyMotion features={domAnimation}>
			<m.button
				onClick={() => {
					const newTheme = currentTheme === "dark" ? "light" : "dark";
					trackEvent.themeToggle(newTheme);
					setTheme(newTheme);
				}}
				initial={initial}
				animate={animate}
				exit={exit}
				transition={transition}
			>
				{currentTheme === "dark" ? <BsSun /> : <BsMoon />}
			</m.button>
		</LazyMotion>
	);
};
