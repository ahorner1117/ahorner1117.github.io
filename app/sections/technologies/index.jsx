import { LazyMotion, domAnimation, m } from "framer-motion";
import { HeadingDivider } from "components";
import { TECHNOLOGIES } from "../../../constants";

export function TechnologiesSection() {
	const total = TECHNOLOGIES.reduce((sum, group) => sum + group.items.length, 0);

	return (
		<LazyMotion features={domAnimation}>
			<section id="tech" className="section">
				<HeadingDivider title="Technologies" />
				<p className="pcard-eyebrow">
					Tools in rotation <b>{total}</b>
				</p>

				<ol className="tech-list">
					{TECHNOLOGIES.map((group, index) => (
						<m.li
							key={group.category}
							className="tech-row"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
						>
							<div className="tech-head">
								<span className="xp-num">
									<b>{String(index + 1).padStart(2, "0")}</b> / {String(TECHNOLOGIES.length).padStart(2, "0")}
								</span>
								<h3 className="tech-title">{group.category}</h3>
								<span className="xp-tenure">{group.items.length} tools</span>
							</div>
							<ul className="tech-chips">
								{group.items.map((item, i) => (
									<li key={`${item.name}-${i}`} className="tech-chip">
										{item.icon}
										<span>{item.name}</span>
									</li>
								))}
							</ul>
						</m.li>
					))}
				</ol>
			</section>
		</LazyMotion>
	);
}
