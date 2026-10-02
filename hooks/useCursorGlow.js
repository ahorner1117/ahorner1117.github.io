// Feeds the cursor position into --mx/--my so a `.pcard-glow` child can follow it
export function useCursorGlow() {
	return (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
		e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
	};
}
