"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Children, isValidElement, cloneElement } from "react";

function flattenToChars(children) {
	const chars = [];

	function walk(node, wrapper = null) {
		if (typeof node === "string") {
			for (const char of node) {
				chars.push({ char, wrapper });
			}
		} else if (isValidElement(node)) {
			const childWrapper = (ch) => cloneElement(node, { key: undefined, children: ch });
			Children.forEach(node.props.children, (child) => {
				walk(child, childWrapper);
			});
		} else if (Array.isArray(node)) {
			node.forEach((child) => walk(child, wrapper));
		}
	}

	Children.forEach(children, (child) => walk(child));
	return chars;
}

const container = {
	hidden: {},
	visible: (delay) => ({
		transition: {
			staggerChildren: 0.03,
			delayChildren: delay
		}
	})
};

const charVariant = {
	hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { type: "spring", damping: 20, stiffness: 200 }
	}
};

// Group chars into words so lines only break at spaces, never mid-word
function groupIntoWords(chars) {
	const words = [];
	let current = [];
	chars.forEach((item, i) => {
		if (item.char === " ") {
			if (current.length) words.push(current);
			current = [];
		} else {
			current.push({ ...item, index: i });
		}
	});
	if (current.length) words.push(current);
	return words;
}

export function SplitText({ children, delay = 0, className }) {
	const chars = useMemo(() => flattenToChars(children), [children]);
	const words = useMemo(() => groupIntoWords(chars), [chars]);
	const plainText = chars.map((c) => c.char).join("");

	return (
		<motion.span
			className={className}
			variants={container}
			custom={delay}
			initial="hidden"
			animate="visible"
			aria-label={plainText}
		>
			{words.map((word, w) => (
				<span key={w}>
					<span style={{ display: "inline-block", whiteSpace: "nowrap" }} aria-hidden="true">
						{word.map((item) => {
							const charEl = (
								<motion.span
									key={item.index}
									variants={charVariant}
									style={{ display: "inline-block" }}
								>
									{item.char}
								</motion.span>
							);
							if (item.wrapper) {
								const wrapped = item.wrapper(charEl);
								return cloneElement(wrapped, { key: item.index });
							}
							return charEl;
						})}
					</span>
					{w < words.length - 1 && " "}
				</span>
			))}
		</motion.span>
	);
}
