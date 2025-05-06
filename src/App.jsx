import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import SpecPost from "./components/SpecPost/SpecPost.jsx";
import SavedPosts from "./components/SavedPosts/SavedPosts.jsx";
import AdminLogin from "./components/AdminLogin/AdminLogin.jsx";
import AdminForgetPasssword from "./components/AdminForgetPassword/AdminForgetPasssword.jsx";
import AdminResetPassword from "./components/AdminResetPassword/AdminResetPassword.jsx";
import AllNationalIds from "./components/AllNationalIds/AllNationalIds.jsx";
import AllProducts from "./components/AllProducts/AllProducts.jsx";
import AddProduct from "./components/AddProduct/AddProduct.jsx";
import FlaggedPosts from "./components/FlaggedPosts/FlaggedPosts.jsx";
import { toast } from "react-hot-toast";
import Shop from "./components/Shop/Shop.jsx";
import Post from "./components/Post/Post.jsx";
import AddPost from "./components/AddPost/AddPost.jsx";
import EditPost from "./components/EditPost/EditPost.jsx";
const router = createBrowserRouter([
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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },

      {
        path: "savedPosts",
        element: (
          <ProtectedRoute>
            <SavedPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "post",
        element: (
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        ),
      },
      {
        path: "addPost",
        element: (
          <ProtectedRoute>
            <AddPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "editPost/:postId",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },

      {
        path: "knowledgeCorner/:id",
        element: (
          <ProtectedRoute>
            <SpecPost />
          </ProtectedRoute>
        ),
      },

      {
        path: "admin/all-products",
        element: <AllProducts />,
      },
      {
        path: "admin/national-ids",
        element: <AllNationalIds />,
      },
      {
        path: "admin/add-product",
        element: <AddProduct />,
      },
      {
        path: "chatbot",
        element: (
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        ),
      },
      {
        path: "shop",
        element: (
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        ),
      },
      {
        path: "chatbot",
        element: (
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },

      {
        path: "admin/forgetPassword",
        element: <AdminForgetPasssword />,
      },
      {
        path: "admin/resetPassword",
        element: <AdminResetPassword />,
      },
      {
        path: "admin/flagged-posts",
        element: <FlaggedPosts />,
      },
      {
        path: "admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/post/:id",
        element: <SpecPost />,
      },
    ],
  },
]);

// Create a wrapper component that combines AuthProvider and RouterProvider
const AppWithProviders = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: "#ff4b4b",
            },
          },
        }}
      />
      <AppWithProviders />
    </div>
  );
}

export default App;
