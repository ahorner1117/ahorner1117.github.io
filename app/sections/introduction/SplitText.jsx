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

export function SplitText({ children, delay = 0, className }) {
	const chars = useMemo(() => flattenToChars(children), [children]);
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
			{chars.map((item, i) => {
				const content = item.char === " " ? "\u00A0" : item.char;
				const charEl = (
					<motion.span
						key={i}
						variants={charVariant}
						style={{ display: "inline-block" }}
						aria-hidden="true"
					>
						{content}
					</motion.span>
				);
				if (item.wrapper) {
				const wrapped = item.wrapper(charEl);
				return cloneElement(wrapped, { key: i });
			}
			return charEl;
			})}
		</motion.span>
	);
}
