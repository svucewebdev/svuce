import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../../services/authService';
import { Newspaper, GraduationCap, Building2, LogOut, Menu, X, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logoutAdmin();
        navigate('/only-access-to-admin');
    };

    const menuItems = [
        { path: '/admin/dashboard/news', label: 'News Management', icon: Newspaper },
        { path: '/admin/dashboard/departments', label: 'Departments', icon: Building2 },
        { path: '/admin/dashboard/academics', label: 'Academics', icon: GraduationCap },
        { path: '/admin/dashboard/placements', label: 'Placements', icon: Briefcase },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-iare-darkblue text-white transition-all duration-300 overflow-hidden`}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-8">SVUCE CRM</h1>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-iare-blue text-white'
                                    : 'text-gray-300 hover:bg-blue-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-blue-800">
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:bg-red-900 hover:text-white"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
                    <div className="w-10"></div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
