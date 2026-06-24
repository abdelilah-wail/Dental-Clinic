import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./providers/ThemeProvider"
import { DirectionProvider } from "./providers/DirectionProvider"
import { ToastProvider } from "./providers/ToastProvider"
import { queryClient } from "./lib/queryClient"
import App from "./App"
import "./i18n"
import "./styles/globals.css"

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<DirectionProvider>
					<BrowserRouter>
						<ToastProvider>
							<App />
						</ToastProvider>
					</BrowserRouter>
				</DirectionProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</React.StrictMode>,
)

