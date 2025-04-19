import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  
  // Debug the auth state to see what's happening
  useEffect(() => {
    console.log("Protected Route - Current User:", currentUser);
    console.log("Protected Route - Allowed Roles:", allowedRoles);
  }, [currentUser, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    console.log(`User role ${currentUser.role} not in allowed roles, redirecting to unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}