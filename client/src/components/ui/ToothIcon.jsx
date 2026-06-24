export function Tooth({ className, ...props }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M12 3c-2.2-1.4-5-1.2-6.4.6C4 5.7 4.2 8.4 5 11c.6 2 .8 4 1.2 6 .3 1.6.7 3 1.6 3 1 0 1.1-1.6 1.4-3.2.2-1.2.5-2.3 1.8-2.3s1.6 1.1 1.8 2.3c.3 1.6.4 3.2 1.4 3.2.9 0 1.3-1.4 1.6-3 .4-2 .6-4 1.2-6 .8-2.6 1-5.3-.6-7.4C17 1.8 14.2 1.6 12 3Z" />
		</svg>
	)
}
