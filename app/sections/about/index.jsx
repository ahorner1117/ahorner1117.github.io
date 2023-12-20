"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, useInView } from "framer-motion";
import { HeadingDivider } from "components";
import { TimeLine } from "./TimeLine";

export function AboutSection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<LazyMotion features={domAnimation}>
			<section id="about" className="section">
				<HeadingDivider title="About me" />
				<div className="pt-10 pb-16 max-w-5xl flex flex-col gap-3">
					<div
						tabIndex="0"
						ref={ref}
						className="text-md font-light leading-relaxed"
						style={{
							transform: isInView ? "none" : "translateX(-200px)",
							opacity: isInView ? 1 : 0,
							transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
						}}
					>
						<p>
							My name is Anthony Horner. I am a seasoned software engineer with over 5 years of
							experience, holding a Bachelors degree in computer science from Florida Atlantic
							University.
						</p>
						<p>
							I specialize in a wide range of web technologies, including JavaScript, HTML, CSS,
							React, Next.js, GraphQL, CMS, Shopify, and API development, among others.
						</p>
						<p className="my-3.5">
							Throughout my career, I have undertaken various projects that showcase my expertise in
							web development. For instance, I developed a customizable, headless Next.js and React
							ECommerce store on the Shopify platform. Leveraging GraphQL for API calls, I utilized
							Shopify Admin API and Storefront API. Additionally, I implemented custom hooks,
							employed Redux for efficient state management, and integrated Contentful headless CMS
							using GraphQL queries and mutations.
						</p>
						<p className="my-3.5">
							In another role, I developed and maintained custom Node.js applications on a
							specialized framework for cloud-based software. This involved creating microservices
							to gather data from various sensors, designing real-time health summary dashboards,
							and implementing IoT technology for seamless communication between sensors and
							cloud-based software.
						</p>
						<p className="my-3.5">
							My diverse experience also includes developing custom WordPress plugins in PHP,
							creating QR codes with augmented reality using JavaScript, and integrating JavaScript
							and jQuery to synchronize Shopify buy buttons and shopping carts across multiple
							domains. I have also designed and implemented theme 2.0 landing pages for Shopify with
							drag-and-drop functionality.
						</p>
						<p className="my-3.5">
							Additionally, I designed and implemented a Java application utilizing Maven and
							Selenium to extract call records from CSV files generated by our softphone. This
							involved initiating REST API calls to a CRM system, dynamically updating deal stages
							based on call disposition. I also crafted personalized email signatures for the entire
							company using HTML and CSS, ensuring consistency and professionalism in communication.
						</p>
					</div>
				</div>

				<TimeLine />
			</section>
		</LazyMotion>
	);
}
