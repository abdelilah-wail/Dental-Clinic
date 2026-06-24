import { Link } from "react-router-dom"

export default function NotFoundPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-bg text-text px-6">
			<div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center">
				<p className="text-sm uppercase tracking-[0.25em] text-muted mb-3">404</p>
				<h1 className="text-2xl font-semibold mb-2">Page not found</h1>
				<p className="text-sm text-muted mb-6">
					The page you're looking for doesn't exist or has moved.
				</p>
				<Link
					to="/dashboard"
					className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary"
				>
					Go to dashboard
				</Link>
			</div>
		</div>
	)
}
