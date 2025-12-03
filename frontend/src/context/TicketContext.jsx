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
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
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
        if (category === 'all') return tickets;
        return tickets.filter(ticket => ticket.category === category);
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            loading,
            addTicket,
            updateTicket,
            deleteTicket,
            getTicketsByCategory,
            stats
        }}>
            {children}
        </TicketContext.Provider>
    );
}
