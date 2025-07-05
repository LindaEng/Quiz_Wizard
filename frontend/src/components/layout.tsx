import { Link, Outlet, useNavigate } from "react-router-dom";
import { rootPath, logoutApiUrl } from "@/paths";

export function Layout() {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await fetch(logoutApiUrl({}), {
				method: "POST",
				credentials: "include"
			});
			// Redirect to login page
			window.location.href = "/login";
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-white font-sans flex flex-col items-center justify-start w-full">
			<div className="w-full px-4">
				<div className="flex justify-between items-center pb-3 mb-6 pt-6 w-full max-w-6xl mx-auto" style={{ borderBottom: '0.5px solid black' }}>
					<h1 className="text-3xl font-extrabold tracking-tight">
						<Link to={rootPath.pattern}>
							Quiz
							<span className="inline-block">🧠</span>
							<span className="text-primary">Wizard</span>
						</Link>
					</h1>
					<button
						onClick={handleLogout}
						className="bg-red-100 border border-black text-red-700 font-bold rounded px-5 py-2 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
					>
						Logout
					</button>
				</div>
				<div className="pb-8 w-full max-w-6xl mx-auto">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
