import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import About from "./components/About/About";
import Profile from "./components/Profile/Profile";
import NotFound from "./components/NotFound/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import KnowledgeCorner from "./components/KnowledgeCorner/KnowledgeCorner";
import Chatbot from "./components/Chatbot/Chatbot";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";

let router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "about",
        element: <About />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "knowledgeCorner",
        element: <KnowledgeCorner />,
      },
      {
        path: "chatbot",
        element: <Chatbot />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
function App() {
  return (
    <div className="bg-[#E3ECE7]">
      <RouterProvider router={router}></RouterProvider>;
    </div>
  );
}

export default App;
