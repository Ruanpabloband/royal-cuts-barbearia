import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Data inválida. Use formato YYYY-MM-DD.' });
    }

    try {
        const pattern = `slot:${date}:*`;
        const bookedSlots = [];

        for await (const key of kv.scanIterator({ match: pattern })) {
            const time = key.split(':').pop();
            bookedSlots.push(time);
        }

        return res.status(200).json({ booked: bookedSlots });
    } catch (error) {
        console.error('Erro ao buscar slots:', error);
        return res.status(200).json({ booked: [], warning: 'Erro ao verificar disponibilidade' });
    }
}

export const config = {
    runtime: 'edge',
};
