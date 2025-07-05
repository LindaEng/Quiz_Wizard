import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { QuizPage } from "@/pages/quiz";
import { RootPage } from "@/pages/root";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { rootPath, quizPath, loginPath, registerPath } from "@/paths";
import { useEffect, useState } from "react";
import { currentUserApiUrl } from "@/paths";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(currentUserApiUrl({}), {
			credentials: "include"
		})
		.then(response => {
			setIsAuthenticated(response.ok);
		})
		.catch(() => {
			setIsAuthenticated(false);
		})
		.finally(() => {
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return <div className="text-center p-8">Loading...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to={loginPath.pattern} replace />;
	}

	return <>{children}</>;
}

const router = createBrowserRouter([
	{
		path: rootPath.pattern,
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		children: [
			{
				path: rootPath.pattern,
				element: <RootPage />,
			},
			{
				path: quizPath.pattern,
				element: <QuizPage />,
			},
		],
	},
	{
		path: loginPath.pattern,
		element: <LoginPage />,
	},
	{
		path: registerPath.pattern,
		element: <RegisterPage />,
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
