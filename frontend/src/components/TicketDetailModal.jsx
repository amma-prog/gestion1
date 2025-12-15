import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Shield, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';

export default function TicketDetailModal({ ticket, onClose }) {
    const { addComment } = useTickets();
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (ticket) {
            fetchComments();
        }
    }, [ticket]);

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/tickets/${ticket.id}/comments/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const comment = await addComment(ticket.id, newComment);
            if (comment) {
                setComments([...comments, comment]);
                setNewComment('');
            }
        } catch (error) {
            alert(`Erreur lors de l'envoi : ${error.message}`);
        }
    };

    if (!ticket) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.90, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[85vh] border border-slate-800"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50 backdrop-blur-md">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    }`}>
                                    {ticket.status.toUpperCase()}
                                </span>
                                <span className="text-sm font-mono text-slate-500">#{ticket.id}</span>
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">{ticket.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Description Card */}
                        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                            <h3 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" />
                                Description du problème
                            </h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{ticket.description}</p>
                        </div>

                        {/* Comments / Chat */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 my-8">
                                <div className="h-px flex-1 bg-slate-800"></div>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" />
                                    Conversation
                                </span>
                                <div className="h-px flex-1 bg-slate-800"></div>
                            </div>

                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                                    <p className="text-slate-500 text-sm">Aucun message pour le moment.</p>
                                    <p className="text-indigo-400 text-xs mt-1">Commencez la discussion !</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {comments.map((comment, index) => {
                                        const isMe = comment.author_id === user.id;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={comment.id}
                                                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isMe
                                                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                                                    : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {/* Logic: 
                                                    If I am Admin: isMe=Shield, !isMe=User 
                                                    If I am User: isMe=User, !isMe=Shield 
                                                */}
                                                    {user.role === 'admin' ? (
                                                        isMe ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />
                                                    ) : (
                                                        isMe ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-5 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${isMe
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                                        }`}>
                                                        {comment.content}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(comment.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-slate-800 bg-slate-900">
                        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Écrivez votre message..."
                                    className="w-full pl-5 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-slate-500 shadow-inner group-hover:bg-slate-800/80"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="p-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 active:scale-95 hover:shadow-indigo-500/40"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
