const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Middleware
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// CORS middleware (for development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ========================================
// Data file path
// ========================================
const dataDir = path.join(__dirname, 'data');
const messagesFile = path.join(dataDir, 'messages.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure messages file exists
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify([], null, 2));
}

// ========================================
// Routes
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get services
app.get('/api/services', (req, res) => {
    const services = [
        { id: 1, name: 'Corte Masculino', price: 45, duration: '30 min', description: 'Cortes modernos e classicos realizados com precisao e technique profissional.' },
        { id: 2, name: 'Barba', price: 35, duration: '20 min', description: 'Barba feita com navalha, toalha quente e hidratacao completa.' },
        { id: 3, name: 'Combo Corte + Barba', price: 70, duration: '45 min', description: 'O pacote completo para quem quer sair renovado e estiloso.' },
        { id: 4, name: 'Degradê', price: 55, duration: '40 min', description: 'Degradê perfeito com transicoes suaves e acabamento impecavel.' },
        { id: 5, name: 'Sobrancelha', price: 20, duration: '10 min', description: 'Design e acabamento de sobrancelha com navalha.' },
        { id: 6, name: 'Corte Infantil', price: 30, duration: '20 min', description: 'Corte especial para os pequenos com todo cuidado e carinho.' }
    ];
    res.json(services);
});

// Contact form
app.post('/api/contact', (req, res) => {
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

    // Read existing messages
    let messages = [];
    try {
        const data = fs.readFileSync(messagesFile, 'utf8');
        messages = JSON.parse(data);
    } catch (err) {
        messages = [];
    }

    // Add new message
    messages.push(newMessage);

    // Save to file
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

// Get all messages (admin)
app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync(messagesFile, 'utf8');
        const messages = JSON.parse(data);
        res.json(messages);
    } catch (err) {
        res.json([]);
    }
});

// ========================================
// Start server
// ========================================
app.listen(PORT, () => {
    console.log(`\n  Royal Cuts Server`);
    console.log(`  -----------------`);
    console.log(`  Local:  http://localhost:${PORT}`);
    console.log(`  API:    http://localhost:${PORT}/api`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});
