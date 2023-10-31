import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuestionsPage from "./pages/QuestionsPage";
import DashboardPage from "./pages/DashboardPage";

export interface ISubmittedResult {
  school_id: number;
  subject_id: number;
  marks: number;
}

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/questions",
      element: <QuestionsPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default App;
