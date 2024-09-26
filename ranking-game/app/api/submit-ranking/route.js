// app/api/submit-ranking/route.js
import dbConnect from '@/lib/mongodb';
import Ranking from '@/models/Ranking';

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const { voter, rankings } = data;

    if (!voter || !rankings) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }

    // Check if this voter has already submitted
    const existingVote = await Ranking.findOne({ voter });
    if (existingVote) {
      return new Response(JSON.stringify({ error: 'You have already voted!' }), { status: 400 });
    }

    await Ranking.create({ voter, rankings });

    return new Response(JSON.stringify({ message: 'Ranking submitted successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}
