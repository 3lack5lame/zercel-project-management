import { useState } from "react";
import { Bell, Lock, Palette, Database, LogOut, ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");
    const [formData, setFormData] = useState({
        language: "en",
        theme: "auto",
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
    });

    const settingsTabs = [
        { id: "general", label: "General" },
        { id: "notifications", label: "Notifications" },
        { id: "privacy", label: "Privacy & Security" },
        { id: "data", label: "Data & Storage" },
    ];

    const handleSaveSettings = async () => {
        try {
            toast.loading("Saving settings...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.dismissAll();
            toast.success("Settings saved successfully");
        } catch {
            toast.dismissAll();
            toast.error("Failed to save settings");
        }
    };

    const handleLogout = async () => {
        try {
            toast.loading("Logging out...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.dismissAll();
            toast.success("Logged out successfully");
            navigate("/");
        } catch {
            toast.dismissAll();
            toast.error("Failed to logout");
        }
    };

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";
    const cardClasses = "rounded-lg border p-6 bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";
    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-900 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Manage your preferences and account settings</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-2">
                        {settingsTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                                    activeTab === tab.id
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <div className={cardClasses}>
                            <div className="flex items-center gap-3 mb-6">
                                <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">General Settings</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Language */}
                                <div className="space-y-2">
                                    <label className={labelClasses}>Language</label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className={inputClasses}
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="zh">Chinese</option>
                                    </select>
                                </div>

                                {/* Theme */}
                                <div className="space-y-2">
                                    <label className={labelClasses}>Theme</label>
                                    <select
                                        value={formData.theme}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                        className={inputClasses}
                                    >
                                        <option value="auto">Auto (System)</option>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                        Choose how you want the interface to appear
                                    </p>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSaveSettings}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === "notifications" && (
                        <div className={cardClasses}>
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Notification Preferences</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        key: "emailNotifications",
                                        label: "Email Notifications",
                                        description: "Receive notifications via email",
                                    },
                                    {
                                        key: "pushNotifications",
                                        label: "Push Notifications",
                                        description: "Receive push notifications in the browser",
                                    },
                                    {
                                        key: "weeklyDigest",
                                        label: "Weekly Digest",
                                        description: "Receive a summary of your activities every week",
                                    },
                                ].map((notif) => (
                                    <div
                                        key={notif.key}
                                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-zinc-900 dark:text-white">{notif.label}</p>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{notif.description}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData[notif.key]}
                                            onChange={(e) =>
                                                setFormData({ ...formData, [notif.key]: e.target.checked })
                                            }
                                            className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-600 cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                ))}

                                {/* Save Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSaveSettings}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy & Security */}
                    {activeTab === "privacy" && (
                        <div className={cardClasses}>
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Privacy & Security</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                    <h3 className="font-medium text-zinc-900 dark:text-white mb-2">Change Password</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        Update your password to keep your account secure
                                    </p>
                                    <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition font-medium text-sm">
                                        Update Password
                                    </button>
                                </div>

                                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                    <h3 className="font-medium text-zinc-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        Add an extra layer of security to your account
                                    </p>
                                    <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition font-medium text-sm">
                                        Enable 2FA
                                    </button>
                                </div>

                                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                    <h3 className="font-medium text-zinc-900 dark:text-white mb-2">Active Sessions</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        Manage your active sessions and devices
                                    </p>
                                    <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition font-medium text-sm">
                                        View Sessions
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data & Storage */}
                    {activeTab === "data" && (
                        <div className={cardClasses}>
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Data & Storage</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                                    <h3 className="font-medium text-zinc-900 dark:text-white mb-2">Export Data</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        Download a copy of your data in JSON or CSV format
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition font-medium text-sm">
                                            Export JSON
                                        </button>
                                        <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg transition font-medium text-sm">
                                            Export CSV
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                                    <h3 className="font-medium text-red-900 dark:text-red-300 mb-2">Delete Account</h3>
                                    <p className="text-sm text-red-800 dark:text-red-400 mb-4">
                                        Permanently delete your account and all associated data
                                    </p>
                                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Integrations Section */}
            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 lg:col-start-2">
                    <div className={`${cardClasses} border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/10`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-purple-900 dark:text-purple-300">Integrations</h3>
                                    <p className="text-sm text-purple-800 dark:text-purple-400 mt-1">
                                        Connect external services and databases to enhance your workflow
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/integrations')}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium text-sm flex-shrink-0"
                            >
                                Manage
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Section */}
            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 lg:col-start-2">
                    <div className={`${cardClasses} border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <LogOut className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-300">Logout</h3>
                                    <p className="text-sm text-red-800 dark:text-red-400 mt-1">
                                        Sign out of your account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm flex-shrink-0"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
