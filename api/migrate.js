import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }

    try {
        const dates = new Set();

        // Check last 90 days for any existing slots
        const now = new Date();
        for (let i = 0; i < 90; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - 30 + i);
            const dateStr = d.toISOString().split('T')[0];
            const keys = await redis.keys(`slot:${dateStr}:*`).catch(() => []);
            if (keys.length > 0) {
                dates.add(dateStr);
            }
        }

        if (dates.size > 0) {
            await redis.sadd('booked_dates', ...Array.from(dates));
        }

        return res.status(200).json({ datesFound: Array.from(dates) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
