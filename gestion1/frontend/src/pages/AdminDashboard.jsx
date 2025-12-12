import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, Clock, CheckCircle, AlertCircle, Search, Filter, LogOut, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketDetailModal from '../components/TicketDetailModal';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { tickets, stats, fetchTickets } = useTickets();
    const { user, logout } = useAuth();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);

    // Refresh tickets on mount to ensure we have the latest data
    useEffect(() => {
        fetchTickets();
    }, []);

    const statsData = [
        { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'bg-blue-500' },
        { label: 'Open', value: stats.open, icon: Clock, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'bg-orange-500' },
        { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-500' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}?status=${newStatus}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                fetchTickets(); // Refresh list
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>{user?.email}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                    Administrator
                                </span>
                            </div>
                        </div>
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
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
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

                {/* Ticket Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm border border-slate-200"
                >
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-slate-900">Ticket Management</h2>

                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="hover:bg-slate-50 cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium">#{ticket.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{ticket.title}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{ticket.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {ticket.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTicket(ticket);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <select
                                                    value={ticket.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                    className="px-3 py-1 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTickets.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No tickets found matching your criteria.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            {selectedTicket && (
                <TicketDetailModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
}
