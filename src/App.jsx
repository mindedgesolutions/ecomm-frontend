import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as wb from "@/pages";
import store from "./store";

// Loaders --------------------------------------------------
import { loader as appLayoutLoader } from "@/pages/app/AppLayout";
import { loader as adCategoryLoader } from "@/pages/app/admin/masters/AdCategoryList";
import { loader as adAddEditProductLoader } from "@/pages/app/admin/products/AdAddProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <wb.WbLayout />,
    children: [{ index: true, element: <wb.WbLanding /> }],
  },
  { path: "/sign-in", element: <wb.AuSignIn /> },
  { path: "/forgot-password", element: <wb.AuForgotPassword /> },
  { path: "/reset-password", element: <wb.AuResetPassword /> },
  { path: "/forbidden", element: <wb.ForbiddenError /> },
  {
    path: "/admin/:slug",
    element: <wb.AppLayout />,
    loader: appLayoutLoader(store),
    errorElement: <wb.RouteError />,
    children: [
      { path: "dashboard", element: <wb.AdDashboard /> },
      {
        path: "products",
        children: [
          { path: "brands", element: <wb.AdBrandList /> },
          {
            path: "categories",
            element: <wb.AdCategoryList />,
            loader: adCategoryLoader(store),
          },
          { index: true, element: <wb.AdProductList /> },
          {
            path: "new",
            element: <wb.AdAddProduct />,
            loader: adAddEditProductLoader,
          },
          {
            path: ":id/edit",
            element: <wb.AdEditProduct />,
            loader: adAddEditProductLoader,
          },
          { path: "discounts", element: <wb.AdDiscountList /> },
          { path: "bought-together", element: <wb.AdBoughtTogetherList /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
