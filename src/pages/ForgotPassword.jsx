import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await forgotPassword(email);
        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-lg mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ProjectHub</h1>
                    <p className="text-gray-600 dark:text-zinc-400">Reset your password</p>
                </div>

                {/* Reset Card */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-zinc-700">
                    {!submitted ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Forgot Password?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Try: demo@example.com (demo user)
                                    </p>
                                </div>

                                {/* Reset Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-6 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Check Your Email
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                We've sent a password reset link to <span className="font-semibold">{email}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                                The link will expire in 24 hours. If you don't see the email, check your spam folder.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>

                {/* Support Section */}
                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        Need help?{' '}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
