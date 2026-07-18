import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    let body;
    try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'bad' }); }
    if (body?.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'no' });

    const dates = await redis.smembers('booked_dates');
    const directGet = await redis.get('slot:2026-07-18:10:00');
    const keysResult = await redis.keys('slot:2026-07-18:*');

    return res.status(200).json({ dates, directGet, keysResult });
}
