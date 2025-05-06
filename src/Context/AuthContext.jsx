import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            setIsAuthenticated(true);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, token, userData) => {
    try {
      setLoading(true);
      if (token) {
        localStorage.setItem("token", token);
        if (userData) {
          try {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          } catch (error) {
            console.error("Error storing user data:", error);
          }
        }

        setIsAuthenticated(true);
        const userName = userData?.name || email || "User";
        toast.success(`Welcome back, ${userName}!`);
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      toast.success("Registration successful! Please login.");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tempCredentials");

    setUser(null);
    setIsAuthenticated(false);

    toast.success("Logged out successfully");
  };

  const value = {
    user,
    role: user?.role || null,
    loading,
    isAuthenticated,
    login,
    register,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
