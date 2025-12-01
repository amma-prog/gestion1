import React, { createContext, useContext, useState } from 'react';

const TicketContext = createContext();

export function useTickets() {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
}

export function TicketProvider({ children }) {
    const [tickets, setTickets] = useState([
        { id: 1, title: 'Issue with login', description: 'Cannot access my account', status: 'open', priority: 'high', category: 'student', createdAt: new Date().toISOString() },
        { id: 2, title: 'Request for materials', description: 'Need course materials', status: 'open', priority: 'low', category: 'teacher', createdAt: new Date().toISOString() }
    ]);

    const addTicket = (ticketData) => {
        const newTicket = {
            id: tickets.length + 1,
            ...ticketData,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        setTickets([newTicket, ...tickets]);
        return newTicket;
    };

    const updateTicket = (id, updates) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, ...updates } : ticket
        ));
    };

    const deleteTicket = (id) => {
        setTickets(tickets.filter(ticket => ticket.id !== id));
    };

    const getTicketsByCategory = (category) => {
        if (category === 'all') return tickets;
        return tickets.filter(ticket => ticket.category === category);
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    return (
        <TicketContext.Provider value={{
            tickets,
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
