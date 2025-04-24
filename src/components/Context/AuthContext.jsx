import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedData = jwtDecode(token);
                console.log('Decoded token data:', decodedData);

                // Extract user data from the token with more detailed logging
                const userData = {
                    name: decodedData.name || decodedData.user?.name || decodedData.userData?.name || decodedData.payload?.name || '',
                    email: decodedData.email || decodedData.user?.email || decodedData.userData?.email || decodedData.payload?.email || '',
                    role: decodedData.role || decodedData.user?.role || decodedData.userData?.role || decodedData.payload?.role || '',
                    photo: decodedData.photo || decodedData.user?.photo || decodedData.userData?.photo || decodedData.payload?.photo || ''
                };

                console.log('Extracted user data:', userData);
                setUserData(userData);
                setIsAuthenticated(true);

                // If on login page and already authenticated, redirect to home
                if (location.pathname === '/login') {
                    navigate('/');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                handleLogout();
            }
        } else {
            setIsAuthenticated(false);
            setUserData(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    const handleLogin = async (token) => {
        try {
            const decodedData = jwtDecode(token);
            console.log('Raw decoded token:', decodedData);

            localStorage.setItem('token', token);

            // Try to get user data from localStorage first
            const storedUserData = localStorage.getItem('userData');
            let userData;

            if (storedUserData) {
                userData = JSON.parse(storedUserData);
                console.log('Using stored user data:', userData);
            } else {
                // Extract user data from the token as fallback
                userData = {
                    name: decodedData.name || decodedData.user?.name || decodedData.userData?.name || decodedData.payload?.name || '',
                    email: decodedData.email || decodedData.user?.email || decodedData.userData?.email || decodedData.payload?.email || '',
                    role: decodedData.role || decodedData.user?.role || decodedData.userData?.role || decodedData.payload?.role || '',
                    photo: decodedData.photo || decodedData.user?.photo || decodedData.userData?.photo || decodedData.payload?.photo || ''
                };
                console.log('Using token user data:', userData);
            }

            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(userData));

            console.log('Final user data being set:', userData);
            setUserData(userData);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            console.error('Invalid token:', error);
            handleLogout();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUserData(null);
        navigate('/login');
    };

    const value = {
        isAuthenticated,
        userData,
        loading,
        handleLogin,
        handleLogout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;