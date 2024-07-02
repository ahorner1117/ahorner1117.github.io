"use client";


import { LazyMotion, domAnimation, m } from "framer-motion";
import { initial, animate, exit, transition } from "utils/motions";
import { IoIosArrowForward } from "react-icons/io";

export function HeadingDivider({ title = "", isContentVisible = false, toggleContent = () => {} }) {
	return (
    <header className="flex items-center">
      <LazyMotion features={domAnimation}>
        <m.h2
          tabIndex="0"
          initial={initial}
          animate={animate}
          exit={exit}
          onClick={toggleContent}
          transition={transition}
          className="heading-divider cursor-pointer"
        >
          {title}
          <div
            className="ml-2"
            style={{
              transition: "transform 300ms ease",
              transform: isContentVisible ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <IoIosArrowForward />
          </div>
        </m.h2>
      </LazyMotion>
    </header>
  );
}
