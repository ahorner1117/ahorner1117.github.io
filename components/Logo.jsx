"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { initial, animate, exit, transition } from "utils/motions";
import { SITE_ROUTES, SITE_STRINGS } from "../constants";

export function Logo() {
	const pathname = usePathname();
	const name = SITE_STRINGS.textLogo.replace(/^@/, "");
	const logoText = (
		<>
			<span>@</span>
			{name}
		</>
	);

	return (
		<LazyMotion features={domAnimation}>
			<m.h3
				className="site-logo"
				initial={initial}
				animate={animate}
				exit={exit}
				transition={transition}
			>
				{pathname === SITE_ROUTES.clients ? (
					<Link href={SITE_ROUTES.home} aria-label="Go to home page" role="link">
						{logoText}
					</Link>
				) : (
					logoText
				)}
			</m.h3>
		</LazyMotion>
	);
}
