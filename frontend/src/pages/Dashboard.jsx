import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Users, Clock, CheckCircle, AlertCircle, Plus, LogOut, Shield, Eye, Search, Filter, MessageSquare, Sparkles, Bell, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import TicketDetailModal from '../components/TicketDetailModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const { tickets, stats, getTicketsByCategory } = useTickets();
    const { user, logout } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bonjour');
        else if (hour < 18) setGreeting('Bon après-midi');
        else setGreeting('Bonsoir');
    }, []);

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

    const statsData = [
        { label: 'Total Tickets', value: stats.total, icon: Ticket, color: 'from-blue-600 to-indigo-600', text: 'text-blue-100' },
        { label: 'En cours', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-600', text: 'text-amber-100' },
        { label: 'Ouverts', value: stats.open, icon: AlertCircle, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-100' },
        { label: 'Résolus', value: stats.resolved, icon: CheckCircle, color: 'from-purple-600 to-pink-600', text: 'text-purple-100' }
    ];

    const safeTickets = Array.isArray(tickets) ? tickets : [];

    const categories = [
        { id: 'all', label: 'Tous', count: safeTickets.length },
        { id: 'technical', label: 'Technique', count: safeTickets.filter(t => t.category === 'technical').length },
        { id: 'billing', label: 'Facturation', count: safeTickets.filter(t => t.category === 'billing').length },
        { id: 'access', label: 'Accès', count: safeTickets.filter(t => t.category === 'access').length },
        { id: 'other', label: 'Autre', count: safeTickets.filter(t => t.category === 'other').length }
    ];

    const displayedTickets = getTicketsByCategory(selectedCategory);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] left-[80%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>

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
                            <Ticket className="w-5 h-5 text-white" />
                        </motion.div>
                        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                            HelpDesk<span className="text-blue-500">.Pro</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white">{user.email.split('@')[0]}</p>
                                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{user.email[0].toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
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
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative py-16 px-8 rounded-3xl overflow-hidden mb-12 flex flex-col md:flex-row justify-between items-end gap-6 shadow-2xl shadow-blue-900/20 border border-white/10 group bg-slate-900"
                >
                    {/* Cyberpunk Grid Background (CSS Only) */}
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
                            {user?.role === 'teacher' ? 'Espace Enseignant' :
                                user?.role === 'employee' ? 'Espace Employé' :
                                    user?.role === 'admin' ? 'Espace Admin' : 'Espace Étudiant'}
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                            {greeting}, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{user?.email.split('@')[0]}</span>
                        </h2>
                        <p className="text-lg text-slate-300 max-w-lg font-medium leading-relaxed drop-shadow-md">
                            Bienvenue sur votre espace. <span className="text-white font-bold bg-blue-600/20 px-2 py-0.5 rounded">{stats.inProgress} tickets en cours</span> requièrent votre attention.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/create-ticket')}
                        className="relative z-10 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl shadow-white/10 hover:shadow-white/25 transition-all flex items-center gap-3 group"
                    >
                        <div className="p-1 bg-slate-950 rounded-full text-white group-hover:rotate-90 transition-transform">
                            <Plus className="w-4 h-4" />
                        </div>
                        Nouveau Ticket
                    </motion.button>
                </motion.div>

                {/* Stats Grid */}
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

                {/* Content Grid */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Filters Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-3 space-y-6"
                    >
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 border border-white/5 sticky top-24">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filtrer par Catégorie
                            </h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <span className="font-medium text-sm">{category.label}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${selectedCategory === category.id
                                            ? 'bg-white/20'
                                            : 'bg-slate-800'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {user?.role === 'admin' && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="w-full p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-white/10 hover:border-blue-500/50 group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-white">Administration</p>
                                                <p className="text-xs text-slate-500 group-hover:text-blue-200 transition-colors">Gérer les accès</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Ticket List */}
                    <div className="lg:col-span-9">
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-white">Vos Tickets Récents</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-white/5"
                            >
                                {displayedTickets.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                                            <Search className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">Aucun ticket trouvé</h4>
                                        <p className="text-slate-400 max-w-sm">
                                            Il semble que vous n'ayez aucun ticket dans cette catégorie pour le moment.
                                        </p>
                                    </div>
                                ) : (
                                    displayedTickets.map((ticket) => (
                                        <motion.div
                                            key={ticket.id}
                                            variants={itemVariants}
                                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="p-6 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-purple-500/10 text-purple-500'
                                                        }`}>
                                                        {ticket.status === 'open' ? <AlertCircle className="w-5 h-5" /> :
                                                            ticket.status === 'in_progress' ? <Clock className="w-5 h-5" /> :
                                                                <CheckCircle className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                                                            {ticket.title}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/5 uppercase tracking-wide">
                                                                {ticket.category}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${ticket.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                ticket.priority === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                                }`}>
                                                                {ticket.priority}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(ticket.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                    <div className="text-right">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            ticket.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                                                                'bg-purple-500/20 text-purple-400'
                                                            }`}>
                                                            {ticket.status === 'open' ? 'Ouvert' :
                                                                ticket.status === 'in_progress' ? 'En cours' :
                                                                    'Résolu'}
                                                        </span>
                                                    </div>
                                                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {
                selectedTicket && (
                    <TicketDetailModal
                        ticket={selectedTicket}
                        onClose={() => setSelectedTicket(null)}
                    />
                )
            }
        </div >
    );
}
