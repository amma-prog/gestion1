import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Users, Clock, CheckCircle, AlertCircle, Search, Filter, LogOut, Shield, Eye, MoreHorizontal, Settings, Trash2, Sparkles, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketDetailModal from '../components/TicketDetailModal';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { tickets, stats, fetchTickets, deleteTicket, updateTicketStatus } = useTickets();
    const { user, logout } = useAuth();
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetchTickets();
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bonjour');
        else if (hour < 18) setGreeting('Bon après-midi');
        else setGreeting('Bonsoir');
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        await updateTicketStatus(ticketId, newStatus);
    };

    const handleDelete = async (e, ticketId) => {
        e.stopPropagation();
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
            await deleteTicket(ticketId);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Matched styles from Student Dashboard
    const statsData = [
        { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'from-blue-600 to-indigo-600', text: 'text-blue-100' },
        { label: 'En attente', value: stats.open, icon: AlertCircle, color: 'from-amber-500 to-orange-600', text: 'text-amber-100' },
        { label: 'En cours', value: stats.inProgress, icon: Clock, color: 'from-purple-600 to-pink-600', text: 'text-purple-100' },
        { label: 'Résolus', value: stats.resolved, icon: CheckCircle, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-100' }
    ];

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
        const matchesRole = filterRole === 'all' || (ticket.owner && ticket.owner.role === filterRole);
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toString().includes(searchTerm);
        return matchesStatus && matchesCategory && matchesRole && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-slate-950/60">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                        >
                            <Shield className="w-5 h-5 text-white" />
                        </motion.div>
                        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                            Admin<span className="text-blue-500">Panel</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white">{user.email.split('@')[0]}</p>
                                    <p className="text-xs text-slate-400 capitalize">Super Admin</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{user.email[0].toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/admin/audit')}
                            className="p-2 ml-4 hover:bg-purple-500/10 text-slate-400 hover:text-purple-400 rounded-xl transition-colors"
                            title="Audit Logs"
                        >
                            <Activity className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="ml-2 p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
                {/* Hero Section (Copied from Student Dashboard) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative py-16 px-8 rounded-3xl overflow-hidden mb-12 flex flex-col md:flex-row justify-between items-end gap-6 shadow-2xl shadow-blue-900/20 border border-white/10 group bg-slate-900 mt-8"
                >
                    {/* Cyberpunk Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 opacity-50"></div>
                        <div className="absolute -top-[100px] left-[20%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md"
                        >
                            <Sparkles className="w-3 h-3" />
                            Espace Administration
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                            {greeting}, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{user?.email.split('@')[0]}</span>
                        </h2>
                        <p className="text-lg text-slate-300 max-w-lg font-medium leading-relaxed drop-shadow-md">
                            Vue d'ensemble du système. <span className="text-white font-bold bg-blue-600/20 px-2 py-0.5 rounded">{stats.open} tickets en attente</span> requièrent votre attention.
                        </p>
                    </div>
                </motion.div>

                {/* Stats Grid (Copied from Student Dashboard Style) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    {statsData.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${stat.color} shadow-lg shadow-slate-950/20 border border-white/5 group`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50 text-white transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-12 h-12 rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <p className={`text-sm font-bold ${stat.text} uppercase tracking-wider mb-1`}>{stat.label}</p>
                                <p className="text-4xl font-black text-white tracking-tight">{stat.value}</p>
                            </div>
                            {/* Glass shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Ticket Management Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 overflow-hidden"
                >
                    <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Settings className="w-5 h-5 text-indigo-400" />
                                Gestion des Tickets
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Gérez et suivez les demandes utilisateurs</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="relative group">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-64 text-white placeholder-slate-500 transition-all shadow-inner"
                                />
                            </div>
                            <div className="relative">
                                <Users className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="pl-11 pr-8 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white appearance-none cursor-pointer hover:bg-slate-900 transition-colors shadow-inner w-44"
                                >
                                    <option value="all" className="bg-slate-950">Tous rôles</option>
                                    <option value="student" className="bg-slate-950">Étudiant</option>
                                    <option value="teacher" className="bg-slate-950">Enseignant</option>
                                    <option value="employee" className="bg-slate-950">Employé</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Filter className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="pl-11 pr-8 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white appearance-none cursor-pointer hover:bg-slate-900 transition-colors shadow-inner w-44"
                                >
                                    <option value="all" className="bg-slate-950">Toutes catégories</option>
                                    <option value="technical" className="bg-slate-950">Technique</option>
                                    <option value="billing" className="bg-slate-950">Facturation</option>
                                    <option value="access" className="bg-slate-950">Accès</option>
                                    <option value="other" className="bg-slate-950">Autre</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Activity className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-11 pr-8 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white appearance-none cursor-pointer hover:bg-slate-900 transition-colors shadow-inner"
                                >
                                    <option value="all" className="bg-slate-950">Tous les statuts</option>
                                    <option value="open" className="bg-slate-950">Ouvert</option>
                                    <option value="in_progress" className="bg-slate-950">En cours</option>
                                    <option value="resolved" className="bg-slate-950">Résolu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/30 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                <tr>
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">Sujet & Description</th>
                                    <th className="px-8 py-5">Catégorie</th>
                                    <th className="px-8 py-5">Priorité</th>
                                    <th className="px-8 py-5">Statut</th>
                                    <th className="px-8 py-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="hover:bg-indigo-500/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-8 py-5 font-mono text-slate-400 text-sm">#{ticket.id}</td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{ticket.title}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs mt-1">{ticket.description}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                                {ticket.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${ticket.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                    ticket.priority === 'medium' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                    }`}></div>
                                                <span className={`text-xs font-medium ${ticket.priority === 'high' ? 'text-red-300' :
                                                    ticket.priority === 'medium' ? 'text-yellow-300' :
                                                        'text-blue-300'
                                                    }`}>
                                                    {ticket.priority.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    value={ticket.status}
                                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                    className="pl-2 pr-8 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer hover:border-slate-600 transition-colors shadow-sm"
                                                >
                                                    <option value="open" className="bg-slate-900 text-slate-300">Ouvrir</option>
                                                    <option value="in_progress" className="bg-slate-900 text-slate-300">Traiter</option>
                                                    <option value="resolved" className="bg-slate-900 text-slate-300">Résoudre</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTicket(ticket);
                                                    }}
                                                    className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all shadow-md hover:shadow-indigo-500/30"
                                                    title="Voir détails"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, ticket.id)}
                                                    className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all shadow-md hover:shadow-red-500/30"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTickets.length === 0 && (
                            <div className="p-16 text-center">
                                <Search className="w-8 h-8 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Aucun ticket trouvé</h3>
                                <p className="text-slate-500">Essayez de modifier vos filtres de recherche.</p>
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
