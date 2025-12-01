import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, Clock, CheckCircle, AlertCircle, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';

export default function Dashboard() {
    const navigate = useNavigate();
    const { tickets, stats, getTicketsByCategory } = useTickets();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const statsData = [
        { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'bg-blue-500' },
        { label: 'Open', value: stats.open, icon: Clock, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'bg-orange-500' },
        { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-500' }
    ];

    const categories = [
        { id: 'all', label: 'Tous', count: tickets.length },
        { id: 'student', label: 'Étudiant', count: tickets.filter(t => t.category === 'student').length },
        { id: 'teacher', label: 'Enseignant', count: tickets.filter(t => t.category === 'teacher').length },
        { id: 'employee', label: 'Employé', count: tickets.filter(t => t.category === 'employee').length }
    ];

    const displayedTickets = getTicketsByCategory(selectedCategory);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Help Desk Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8"
                >
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Catégories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === category.id
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="text-center">
                                    <Users className={`w-8 h-8 mx-auto mb-2 ${selectedCategory === category.id ? 'text-primary-600' : 'text-slate-400'
                                        }`} />
                                    <p className="font-medium text-slate-900">{category.label}</p>
                                    <p className="text-sm text-slate-500">{category.count} tickets</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Tickets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200"
                >
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
                        <button
                            onClick={() => navigate('/create-ticket')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </button>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {displayedTickets.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                Aucun ticket pour le moment
                            </div>
                        ) : (
                            displayedTickets.map((ticket) => (
                                <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-900 mb-1">#{ticket.id} - {ticket.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className="text-sm text-slate-500">{ticket.category}</span>
                                            </div>
                                        </div>
                                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
