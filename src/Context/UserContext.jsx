import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const updateUser = (userData) => {
        const updatedData = {
            ...userData,
            token: `noteApp__${userData.token}`, 
        };

        setUser(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("userData");
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
