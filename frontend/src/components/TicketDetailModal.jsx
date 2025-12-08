import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Shield, MessageSquare } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';

export default function TicketDetailModal({ ticket, onClose }) {
    const { addComment } = useTickets();
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ticket) {
            fetchComments();
        }
    }, [ticket]);

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

        const comment = await addComment(ticket.id, newComment);
        if (comment) {
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    if (!ticket) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                        ticket.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <span className="text-sm text-slate-500">#{ticket.id}</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{ticket.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Description */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                            <p className="text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        {/* Comments */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Discussion
                            </h3>

                            {loading ? (
                                <div className="text-center py-4 text-slate-500">Loading comments...</div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                                    No comments yet. Start the conversation!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={`flex gap-3 ${comment.author_id === user.id ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.author_id === user.id ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {comment.author_id === user.id ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                            </div>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${comment.author_id === user.id
                                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                }`}>
                                                <p className="text-sm">{comment.content}</p>
                                                <p className={`text-xs mt-1 ${comment.author_id === user.id ? 'text-primary-200' : 'text-slate-400'
                                                    }`}>
                                                    {new Date(comment.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Send
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
