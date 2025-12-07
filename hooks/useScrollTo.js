import { useEffect, useState } from "react";
import { navigationHeight } from "utils/theme-config";

export function useScrollTo() {
	const [height, setHeight] = useState(navigationHeight);

	useEffect(() => {
		const handleResize = () => {
			if (window.matchMedia("(max-width: 480px)")) {
				setHeight(56);
			} else {
				setHeight(navigationHeight);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const scrollToEl = (e) => {
		const hash = e.target.hash;
		const targetPathname = e.target.pathname;
		const currentPathname = window.location.pathname;

		// If no hash (regular page link like /clients), let default navigation happen
		if (!hash) {
			return;
		}

		// If navigating to a different page (e.g., /#intro from /clients), let default navigation happen
		if (targetPathname !== currentPathname) {
			return;
		}

		// For hash links on the same page (section anchors), prevent default and smooth scroll
		e.preventDefault();
		const element = document?.querySelector(hash);

		if (element) {
			const offsetTop = element.offsetTop - height;
			scroll({
				top: offsetTop,
				behavior: "smooth"
			});
		}
	};

	return { scrollToEl };
}
