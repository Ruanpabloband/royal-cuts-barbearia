export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
        return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const { name, email, phone, message } = body || {};

    if (!name || !message) {
        return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
    }

    const newMessage = {
        name,
        email: email || '',
        phone: phone || '',
        message,
        createdAt: new Date().toISOString()
    };

    console.log('New contact message:', newMessage);

    return res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso!'
    });
}
