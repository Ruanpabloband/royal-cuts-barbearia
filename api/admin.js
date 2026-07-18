import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const SERVICES = {
    'Barba': 15,
    'Combo Corte + Barba': 25,
    'Degradê': 20,
    'Corte Social': 20
};

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

    const { password } = body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Senha incorreta.' });
    }

    try {
        const dates = await redis.smembers('booked_dates');
        const bookings = [];

        if (dates.length > 0) {
            const slotArrays = await Promise.all(
                dates.map(d => redis.keys(`slot:${d}:*`).catch(e => { console.error('keys error:', e.message); return []; }))
            );

            const debugKeys = {};
            for (let d = 0; d < dates.length; d++) {
                debugKeys[dates[d]] = slotArrays[d];
            }

            for (let d = 0; d < dates.length; d++) {
                const date = dates[d];
                const keys = slotArrays[d];

                for (let i = 0; i < keys.length; i++) {
                    const parts = keys[i].split(':');
                    if (parts.length !== 3) continue;

                    const time = parts[2];
                    const data = await redis.get(keys[i]).catch(() => null);

                    if (data) {
                        const price = SERVICES[data.service] || 0;
                        bookings.push({
                            date,
                            time,
                            service: data.service,
                            name: data.name,
                            phone: data.phone,
                            price,
                            bookedAt: data.bookedAt
                        });
                    }
                }
            }
        }

        bookings.sort((a, b) => {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return b.time.localeCompare(a.time);
        });

        return res.status(200).json({
            success: true,
            bookings,
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((sum, b) => sum + b.price, 0),
            debugDates: dates,
            debugKeys
        });
    } catch (error) {
        console.error('Erro ao buscar dados admin:', error.message);
        return res.status(500).json({ error: 'Erro ao carregar dados.' });
    }
}
