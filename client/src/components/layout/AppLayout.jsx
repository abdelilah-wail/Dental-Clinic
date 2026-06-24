import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function AppLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="app-shell min-h-screen flex text-text">
			<Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex-1 flex flex-col min-w-0 lg:ms-[224px]">
				<Topbar onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 p-3 sm:p-4 lg:p-5">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
