"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { HeadingDivider } from "components";
import { trackEvent } from "utils";

const LaunchScene = dynamic(() => import("./LaunchScene"), { ssr: false });

const LINKS = {
	appStore: "https://apps.apple.com/us/app/fasttrack-rides/id6758738999",
	googlePlay: "https://play.google.com/store/apps/details?id=com.anthonyhorner.fasttrack",
	site: "https://fasttrackapp.biz"
};

const STATS = [
	{ value: "3,000+", label: "Drivers in the first few months" },
	{ value: "±0.02s", label: "0–60 timing accuracy" },
	{ value: "100 Hz", label: "Accelerometer fused with GPS" },
	{ value: "7", label: "Native Swift modules" }
];

const FEATURES = [
	{
		title: "Launch-detect timing",
		text: "GPS Doppler fused with the 100 Hz accelerometer through a Kalman filter. The timer arms itself and fires the instant the car launches.",
		screen: "/fasttrack/screen-timer.webp"
	},
	{
		title: "Drive with Friends",
		text: "Live multiplayer sessions with a six-character code: shared map, live speeds, and LiveKit voice chat between cars.",
		screen: "/fasttrack/screen-drive-friends.webp"
	},
	{
		title: "Official races",
		text: "Time-boxed community and official races. Every valid run in the window counts, and P1 at the checkered flag takes the badge.",
		screen: "/fasttrack/screen-race.webp"
	},
	{
		title: "Garage & mods",
		text: "Every run is tied to the build it was made on, so drivers can prove exactly what each mod was worth.",
		screen: "/fasttrack/screen-garage.webp"
	},
	{
		title: "Profiles & bests",
		text: "Verified personal bests, 65 badges, a social feed, groups, and DMs. The garage becomes a community.",
		screen: "/fasttrack/screen-profile.webp"
	}
];

const STACK = [
	"React Native",
	"Expo SDK 55",
	"Expo Router",
	"TypeScript",
	"Swift",
	"Supabase",
	"Postgres + RLS",
	"Realtime",
	"20 Edge Functions",
	"pg_cron",
	"Zustand",
	"Reanimated",
	"LiveKit",
	"RevenueCat",
	"Stripe Connect",
	"CarPlay",
	"Live Activities",
	"Object Capture",
	"EAS Update",
	"Sentry",
	"Jest + Detox"
];

const ADVANCE_MS = 4500;
const PB_SECONDS = 3.69;

function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);
	return reduced;
}

function hasWebGL() {
	try {
		const canvas = document.createElement("canvas");
		return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
	} catch {
		return false;
	}
}

// Loops a 0–60 run up to the real personal best shown in the app
function TimerReadout({ active, reducedMotion }) {
	const [elapsed, setElapsed] = useState(reducedMotion ? PB_SECONDS : 0);

	useEffect(() => {
		if (!active || reducedMotion) {
			setElapsed(PB_SECONDS);
			return;
		}
		let frame;
		const start = performance.now();
		const tick = (now) => {
			const cycle = ((now - start) / 1000) % (PB_SECONDS + 2.6);
			setElapsed(Math.min(cycle, PB_SECONDS));
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [active, reducedMotion]);

	const progress = elapsed / PB_SECONDS;
	const mph = Math.round(60 * (1 - Math.pow(1 - progress, 1.6)));
	const done = elapsed >= PB_SECONDS;

	return (
		<div className={`np-timer ${done ? "is-done" : ""}`} aria-hidden="true">
			<span className="np-timer-label">0–60 MPH · personal best</span>
			<span className="np-timer-value">
				{elapsed.toFixed(2)}
				<small>s</small>
			</span>
			<span className="np-timer-bar">
				<span style={{ transform: `scaleX(${progress})` }} />
			</span>
			<span className="np-timer-speed">{String(mph).padStart(2, "0")} mph</span>
		</div>
	);
}

function Stage() {
	const stageRef = useRef(null);
	const progressRef = useRef(0);
	const [shouldMount, setShouldMount] = useState(false);
	const [active, setActive] = useState(false);
	const [webgl, setWebgl] = useState(true);
	const reducedMotion = usePrefersReducedMotion();

	useEffect(() => {
		setWebgl(hasWebGL());
		const el = stageRef.current;

		const nearby = new IntersectionObserver(([entry]) => entry.isIntersecting && setShouldMount(true), {
			rootMargin: "600px 0px"
		});
		const visible = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
		nearby.observe(el);
		visible.observe(el);

		const onScroll = () => {
			const rect = el.getBoundingClientRect();
			const total = window.innerHeight + rect.height;
			progressRef.current = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			nearby.disconnect();
			visible.disconnect();
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<div ref={stageRef} className="np-stage">
			{webgl && shouldMount ? (
				<LaunchScene active={active} progressRef={progressRef} reducedMotion={reducedMotion} />
			) : (
				<div className="np-fallback" aria-hidden="true">
					FASTTRACK
				</div>
			)}
			<div className="np-vignette" aria-hidden="true" />

			<div className="np-hud np-hud--tl" aria-hidden="true">
				<span className="np-rec" />
				Launch detect · armed
			</div>
			<div className="np-hud np-hud--tr" aria-hidden="true">
				GPS Doppler + 100 Hz IMU
				<br />
				Kalman fused
			</div>
			<div className="np-hud np-hud--bl">
				<TimerReadout active={active} reducedMotion={reducedMotion} />
			</div>
			<div className="np-hud np-hud--br">
				<img src="/fasttrack/icon.png" alt="" width={44} height={44} />
				<span>
					FastTrack
					<br />
					<em>iOS · Android</em>
				</span>
			</div>
		</div>
	);
}

function Showcase() {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const deviceRef = useRef(null);

	useEffect(() => {
		if (paused) return;
		const id = setTimeout(() => setIndex((i) => (i + 1) % FEATURES.length), ADVANCE_MS);
		return () => clearTimeout(id);
	}, [index, paused]);

	const handleTilt = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		deviceRef.current?.style.setProperty("--ry", `${x * 18}deg`);
		deviceRef.current?.style.setProperty("--rx", `${-y * 12}deg`);
	};
	const resetTilt = () => {
		deviceRef.current?.style.setProperty("--ry", "-14deg");
		deviceRef.current?.style.setProperty("--rx", "4deg");
	};

	const prev = (index - 1 + FEATURES.length) % FEATURES.length;
	const next = (index + 1) % FEATURES.length;

	return (
		<div className="np-showcase">
			<ol
				className="np-features"
				onMouseEnter={() => setPaused(true)}
				onMouseLeave={() => setPaused(false)}
				onFocus={() => setPaused(true)}
				onBlur={() => setPaused(false)}
			>
				{FEATURES.map((feature, i) => (
					<li key={feature.title}>
						<button
							type="button"
							className={`np-feature ${i === index ? "is-active" : ""}`}
							aria-pressed={i === index}
							onMouseEnter={() => setIndex(i)}
							onFocus={() => setIndex(i)}
							onClick={() => setIndex(i)}
						>
							<span className="np-feature-num">{String(i + 1).padStart(2, "0")}</span>
							<span className="np-feature-body">
								<span className="np-feature-title">{feature.title}</span>
								<span className="np-feature-text">
									<span>{feature.text}</span>
								</span>
							</span>
							{i === index && !paused && (
								<span
									key={index}
									className="np-feature-progress"
									style={{ animationDuration: `${ADVANCE_MS}ms` }}
									aria-hidden="true"
								/>
							)}
						</button>
					</li>
				))}
			</ol>

			<div className="np-device-wrap" onPointerMove={handleTilt} onPointerLeave={resetTilt}>
				<div className="np-device-glow" aria-hidden="true" />
				<div className="np-phone np-phone--ghost np-phone--left" aria-hidden="true">
					<img src={FEATURES[prev].screen} alt="" loading="lazy" />
				</div>
				<div className="np-phone np-phone--ghost np-phone--right" aria-hidden="true">
					<img src={FEATURES[next].screen} alt="" loading="lazy" />
				</div>
				<div ref={deviceRef} className="np-phone np-phone--main">
					<span className="np-island" aria-hidden="true" />
					{FEATURES.map((feature, i) => (
						<img
							key={feature.screen}
							src={feature.screen}
							alt={`FastTrack app: ${feature.title}`}
							loading="lazy"
							className={i === index ? "is-active" : ""}
							aria-hidden={i !== index}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function NotableProjectsSection() {
	const trackLink = (label, url) => () => trackEvent.projectExternalLink(`FastTrack ${label}`, url);

	return (
		<LazyMotion features={domAnimation}>
			<section id="notable" className="section np">
				<HeadingDivider title="Notable Projects" />
				<p className="pcard-eyebrow">
					Flagship build <b>01</b>
				</p>

				<Stage />

				<div className="np-intro">
					<m.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
					>
						<p className="np-kicker">
							<span>01</span> FastTrack · iOS &amp; Android app
						</p>
						<h3 className="np-headline">
							Prove <em>your car.</em>
						</h3>
						<p className="np-lede">
							FastTrack turns the phone already in your pocket into a GPS performance timer. Drivers
							time verified 0–60, quarter-mile, and rolling runs, then stack them against everyone
							else on leaderboards, in races, and in a full social community. I designed and built
							it end to end, from the native Swift sensor modules to the Supabase backend.
						</p>
						<div className="np-ctas">
							<a
								className="btn btn--split np-btn"
								href={LINKS.appStore}
								target="_blank"
								rel="noopener noreferrer"
								onClick={trackLink("App Store", LINKS.appStore)}
							>
								<span className="btn-label">App Store</span>
								<span className="btn-icon btn-icon--external" aria-hidden="true">
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 17L17 7M9 7h8v8" />
									</svg>
								</span>
							</a>
							<a
								className="btn btn--ghost"
								href={LINKS.googlePlay}
								target="_blank"
								rel="noopener noreferrer"
								onClick={trackLink("Google Play", LINKS.googlePlay)}
							>
								Google Play
							</a>
							<a
								className="btn btn--ghost"
								href={LINKS.site}
								target="_blank"
								rel="noopener noreferrer"
								onClick={trackLink("site", LINKS.site)}
							>
								fasttrackapp.biz
							</a>
						</div>
					</m.div>

					<dl className="np-stats">
						{STATS.map((stat, i) => (
							<m.div
								key={stat.label}
								className="np-stat"
								initial={{ opacity: 0, y: 18 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 + i * 0.08 }}
							>
								<dt>{stat.label}</dt>
								<dd>{stat.value}</dd>
							</m.div>
						))}
					</dl>
				</div>

				<Showcase />

				<div className="np-marquee" aria-label="FastTrack tech stack">
					<span className="np-marquee-label">Under the hood</span>
					<div className="np-marquee-viewport">
						<div className="np-marquee-track">
							{[0, 1].map((copy) => (
								<ul key={copy} aria-hidden={copy === 1}>
									{STACK.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							))}
						</div>
					</div>
				</div>
			</section>
		</LazyMotion>
	);
}
