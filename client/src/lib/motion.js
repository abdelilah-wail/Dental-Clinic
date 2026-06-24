// Shared premium easing + durations (mirror tokens.css).
export const easeLux = [0.22, 1, 0.36, 1]
export const dur = { fast: 0.15, base: 0.22, slow: 0.36 }

export const transition = {
	duration: dur.base,
	ease: easeLux,
}

// Fade + soft rise — default entrance for cards, panels, sections.
export const fadeRise = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0, transition },
	exit: { opacity: 0, y: 8, transition: { duration: dur.fast, ease: easeLux } },
}

// Scale-in — for modals, popovers, premium stat cards.
export const scaleIn = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: { opacity: 1, scale: 1, transition },
	exit: { opacity: 0, scale: 0.98, transition: { duration: dur.fast, ease: easeLux } },
}

// Staggered container — animate lists/grids of cards gracefully.
export const stagger = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

// Interactive feel for buttons/cards (use with whileHover / whileTap).
export const hoverLift = { y: -2, transition: { duration: dur.fast, ease: easeLux } }
export const tapPress = { scale: 0.98 }
