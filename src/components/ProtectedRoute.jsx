import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-900">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                    <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
