const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !message) {
        return res.status(400).json({ error: 'Nome e mensagem sao obrigatorios.' });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email: email || '',
        phone: phone || '',
        message,
        createdAt: new Date().toISOString()
    };

    // For Vercel, we'll just return success
    // In production, you would save to a database or send an email
    console.log('New contact message:', newMessage);

    return res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso!'
    });
};
