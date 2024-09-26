// models/Ranking.js
import mongoose from 'mongoose';

const RankingSchema = new mongoose.Schema({
  voter: {
    type: String,
    required: true,
  },
  rankings: {
    type: Map,
    of: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ranking || mongoose.model('Ranking', RankingSchema);
