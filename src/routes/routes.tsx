import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
import { ProtectedRoute } from "./protected-route";
import Login from "@/pages/auth/LoginPage";
import Home from "@/pages/home/HomePage";
import NotFound from "@/pages/NotFoundPage";

const Routes = () => {

  const { token } = useAuth();

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, 
      children: [
        {
          path: "/",
          element: <Home />,
        },
      ],
    },
  ];


  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Home />,
    }
  ];

  const commonRoutes = [
    {
      path: "*",
      element: <NotFound />, 
    },
  ];

  const router = createBrowserRouter([
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    ...commonRoutes,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;