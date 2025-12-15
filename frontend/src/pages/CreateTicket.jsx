import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, MessageSquare, AlertCircle, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';

export default function CreateTicket() {
    const navigate = useNavigate();
    const { addTicket } = useTickets();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addTicket(formData);
        // navigate('/dashboard'); // Let the context handle it or navigate after
        navigate('/dashboard');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 py-12 px-6 relative overflow-hidden">
            {/* Cyberpunk Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-40 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-2xl mx-auto relative z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors border border-white/5">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Retour au tableau de bord</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-r from-slate-900/80 to-slate-900/40 border-b border-white/5 relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-24 h-24 text-indigo-500 transform rotate-12" />
                        </div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                            Nouveau Ticket
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Décrivez votre demande, notre équipe d'élite est prête.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Sujet de la demande
                                </label>
                                <div className="relative group">
                                    <MessageSquare className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner"
                                        placeholder="Ex: Problème d'accès au serveur..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                        Catégorie
                                    </label>
                                    <div className="relative group">
                                        <Bookmark className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-inner cursor-pointer"
                                            required
                                        >
                                            <option value="" className="bg-slate-950">Sélectionner...</option>
                                            <option value="technical" className="bg-slate-950">Technique</option>
                                            <option value="billing" className="bg-slate-950">Facturation</option>
                                            <option value="access" className="bg-slate-950">Accès</option>
                                            <option value="other" className="bg-slate-950">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                        Priorité
                                    </label>
                                    <div className="relative group">
                                        <AlertCircle className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner cursor-pointer"
                                        >
                                            <option value="low" className="bg-slate-950">Basse</option>
                                            <option value="medium" className="bg-slate-950">Moyenne</option>
                                            <option value="high" className="bg-slate-950">Haute</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Description détaillée
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner resize-none leading-relaxed"
                                    placeholder="Expliquez nous tout les détails..."
                                    required
                                />
                                <div className="text-right text-xs text-slate-600 mt-2">
                                    Soyez précis pour une résolution rapide
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col md:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 transition-all group"
                            >
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                Soumettre le ticket
                            </motion.button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white font-medium rounded-xl transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
