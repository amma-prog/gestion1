import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Search, Activity, User, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuditLogs() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setError(null);
            // Added trailing slash to ensure correct routing
            const response = await fetch('/api/audit/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            } else {
                const text = await response.text();
                setError(`Erreur ${response.status}: ${text}`);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError(`Erreur réseau: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toString().includes(searchTerm)
    );

    const getActionColor = (action) => {
        if (action.includes('DELETE')) return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (action.includes('CREATE')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        if (action.includes('UPDATE')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-2 -ml-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-white">
                                Audit<span className="text-purple-500">Logs</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Actions</h3>
                            <p className="text-3xl font-black text-white">{logs.length}</p>
                        </div>
                        <div className="absolute right-0 top-0 p-6 opacity-10">
                            <Activity className="w-16 h-16 text-purple-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Main Table Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-400" />
                            Historique des Activités
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Rechercher une action, un user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-purple-500/50 outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Logs</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Utilisateur</th>
                                    <th className="px-6 py-4">Cible</th>
                                    <th className="px-6 py-4">Détails</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chargement...</td></tr>
                                ) : filteredLogs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/[0.02]"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-slate-600">#{log.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-300">
                                            ID: {log.user_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {log.target_type} #{log.target_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">
                                            {log.details || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
