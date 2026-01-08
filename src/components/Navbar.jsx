import { SearchIcon, PanelLeft, LogOut, Settings, HelpCircle, Moon, Sun, MoreVertical, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import { MoonIcon, SunIcon } from 'lucide-react'
import { assets } from '../assets/assets'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector(state => state.theme);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: User, label: 'Profile', action: () => navigate('/profile') },
        { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
        { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help') },
        { divider: true },
        { icon: LogOut, label: 'Logout', action: () => console.log('Logout'), className: 'text-red-600 dark:text-red-400' },
    ];

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="pl-8 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95">
                        {
                            theme === "light"
                                ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                                : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* User Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            <img src={assets.profile_img_a} alt="User Avatar" className="size-7 rounded-full" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 py-1 z-50">
                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400">john@example.com</p>
                                </div>

                                {/* Menu Items */}
                                {menuItems.map((item, index) => (
                                    item.divider ? (
                                        <div key={`divider-${index}`} className="border-t border-gray-200 dark:border-zinc-700 my-1" />
                                    ) : (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                item.action();
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700 ${item.className || 'text-gray-700 dark:text-zinc-300'}`}
                                        >
                                            <item.icon className="size-4" />
                                            {item.label}
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
