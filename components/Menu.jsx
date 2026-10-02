"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useScrollTo } from "hooks";
import { BsArrowReturnLeft } from "react-icons/bs";
import { initial, animate, exit, transition, trackEvent } from "utils";
import { MENU_OPTIONS, SITE_ROUTES, SITE_STRINGS } from "../constants";

const PORTAL_HOSTNAMES = ["anthonyhorner.com", "www.anthonyhorner.com"];

export function Menu({ onClick = () => {} }) {
	let content, mainMenu, backMenu;
	const pathname = usePathname();
	const { scrollToEl } = useScrollTo();
	const activeId = useActiveSection();

	const sortAscending = (a, b) => a.id - b.id;

	// "Clients Portal" only shows on the Vercel production domain. Resolved after mount
	// so the server render and first client render match.
	const [showClientsPortal, setShowClientsPortal] = useState(false);
	useEffect(() => {
		setShowClientsPortal(PORTAL_HOSTNAMES.includes(window.location.hostname));
	}, []);

	const getFilteredMenuItems = () =>
		showClientsPortal
			? [...MENU_OPTIONS]
			: MENU_OPTIONS.filter((item) => item.name !== "Clients Portal");

	const handleOnClick = (e) => {
		// Track navigation click
		const href = e.currentTarget.getAttribute('href');
		const label = e.currentTarget.getAttribute('title');
		trackEvent.navigationClick(label, href);

		scrollToEl(e);
		window.setTimeout(() => onClick(), 350);
	};

	const filteredMenuItems = getFilteredMenuItems();

	mainMenu = (
		<m.nav initial={initial} animate={animate} exit={exit} transition={transition} role="menu">
			<ul className="flex justify-center gap-6 lg:gap-8 flex-col md:flex-row items-start md:items-center">
				{filteredMenuItems.sort(sortAscending).map((menuItem, index) => {
					// If we're not on home page and the menu item is a hash link, prepend "/"
					const isHashLink = menuItem.url.startsWith("#");
					const isOnHomePage = pathname === SITE_ROUTES.home;
					const href = isHashLink && !isOnHomePage ? `/${menuItem.url}` : menuItem.url;
					const isActive = isHashLink && isOnHomePage && activeId === menuItem.url.slice(1);

					return (
						<li key={menuItem.id}>
							<a
								href={href}
								title={menuItem.name}
								onClick={handleOnClick}
								aria-current={isActive ? "location" : undefined}
								className={`nav-link ${isHashLink ? "" : "nav-link--cta"} ${isActive ? "is-active" : ""}`}
							>
								{isHashLink && (
									<span className="mobile-nav-index">{String(index + 1).padStart(2, "0")}</span>
								)}
								{menuItem.name}
							</a>
						</li>
					);
				})}
			</ul>
		</m.nav>
	);

	backMenu = (
		<m.div initial={initial} animate={animate} exit={exit} transition={transition}>
			<Link
				href={SITE_ROUTES.home}
				title={SITE_STRINGS.backToMainPageTitle}
				className="icon-link-btn"
			>
				<span>
					<BsArrowReturnLeft />
				</span>
				{SITE_STRINGS.backToMainText}
			</Link>
		</m.div>
	);

	content = pathname === SITE_ROUTES.projects ? backMenu : mainMenu;

	if (filteredMenuItems.length === 0) {
		return null;
	}

	return <LazyMotion features={domAnimation}>{content}</LazyMotion>;
}

// Id of the last menu section whose top has scrolled past 40% of the viewport
function useActiveSection() {
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		const ids = MENU_OPTIONS.filter((item) => item.url.startsWith("#")).map((item) => item.url.slice(1));
		let frame = null;

		const update = () => {
			frame = null;
			let current = "";
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
			}
			setActiveId(current);
		};
		const onScroll = () => {
			if (frame === null) frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame !== null) window.cancelAnimationFrame(frame);
		};
	}, []);

	return activeId;
}
