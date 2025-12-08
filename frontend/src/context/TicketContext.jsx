import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TicketContext = createContext();

export function useTickets() {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
}

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // Fetch tickets from API
    const fetchTickets = async () => {
        console.log('Fetching tickets... Token:', !!token);
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Fetch response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched tickets:', data);
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [token]);

    const addTicket = async (ticketData) => {
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(ticketData),
            });

            if (response.ok) {
                const newTicket = await response.json();
                setTickets([...tickets, newTicket]);
                return newTicket;
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const updateTicket = (id, updates) => {
        // TODO: Implement API update
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, ...updates } : ticket
        ));
    };

    const deleteTicket = (id) => {
        // TODO: Implement API delete
        setTickets(tickets.filter(ticket => ticket.id !== id));
    };

    const getTicketsByCategory = (category) => {
        if (!Array.isArray(tickets)) return [];
        if (category === 'all') return tickets;
        return tickets.filter(ticket => ticket.category === category);
    };

    const addComment = async (ticketId, content) => {
        try {
            const response = await fetch(`/api/tickets/${ticketId}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const newComment = await response.json();
                // Update local state if needed, or just return the comment
                return newComment;
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const stats = {
        total: Array.isArray(tickets) ? tickets.length : 0,
        open: Array.isArray(tickets) ? tickets.filter(t => t.status === 'open').length : 0,
        inProgress: Array.isArray(tickets) ? tickets.filter(t => t.status === 'in_progress').length : 0,
        resolved: Array.isArray(tickets) ? tickets.filter(t => t.status === 'resolved').length : 0
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            loading,
            addTicket,
            updateTicket,
            deleteTicket,
            getTicketsByCategory,
            stats,
            fetchTickets,
            addComment
        }}>
            {children}
        </TicketContext.Provider>
    );
}
