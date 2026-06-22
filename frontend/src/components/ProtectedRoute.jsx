// Create a new file: components/ProtectedRoute.js
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(ShopContext);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default ProtectedRoute;