import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GitHubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles OAuth callback automatically
    // Just redirect to dashboard after a short delay to let Supabase process the session
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-300">Setting up your GitHub account...</p>
      </div>
    </div>
  );
}
