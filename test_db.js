import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../backend/.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internal-management-platform';

async function checkEvents() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const events = await db.collection('events').find({}).toArray();
        console.log(`Found ${events.length} events.`);
        for (const e of events) {
            console.log(`Event: ${e.title} | Status: ${e.status} | ticketsSold: ${e.ticketsSold} | ticketPrice: ${e.ticketPrice}`);
        }

        const agg = await db.collection('events').aggregate([
            { $match: { status: 'upcoming' } },
            {
                $group: {
                    _id: null,
                    totalCapacity: { $sum: '$capacity' },
                    totalTicketsSold: { $sum: '$ticketsSold' },
                    totalRevenue: { $sum: { $multiply: [{ $ifNull: ['$ticketsSold', 0] }, { $ifNull: ['$ticketPrice', 0] }] } }
                }
            }
        ]).toArray();
        console.log('Aggregation with ifNull:', agg);

        const aggOld = await db.collection('events').aggregate([
            { $match: { status: 'upcoming' } },
            {
                $group: {
                    _id: null,
                    totalCapacity: { $sum: '$capacity' },
                    totalTicketsSold: { $sum: '$ticketsSold' },
                    totalRevenue: { $sum: { $multiply: ['$ticketsSold', '$ticketPrice'] } }
                }
            }
        ]).toArray();
        console.log('Aggregation without ifNull:', aggOld);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
checkEvents();
