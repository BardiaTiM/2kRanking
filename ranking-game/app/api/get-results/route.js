// app/api/get-results/route.js
import dbConnect from '@/lib/mongodb';
import Ranking from '@/models/Ranking';

export async function GET() {
  try {
    await dbConnect();

    const rankings = await Ranking.find({});
    const friendList = ['Smiff', 'AT', 'Lob', 'Atrain', 'Heez', 'Deevee', 'Shabaz', 'Naz'];
    const totals = friendList.reduce((acc, friend) => {
      acc[friend] = 0;
      return acc;
    }, {});

    // Calculate the total scores for each friend
    rankings.forEach((ranking) => {
      for (const [friend, rank] of ranking.rankings.entries()) {
        totals[friend] += rank;
      }
    });

    // Calculate average rankings
    const averages = {};
    friendList.forEach((friend) => {
      averages[friend] = rankings.length ? totals[friend] / rankings.length : 0;
    });

    return new Response(JSON.stringify(averages), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error calculating averages' }), { status: 500 });
  }
}
