import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get('meetingId');

    const matchStage: any = {};
    if (meetingId && meetingId !== 'all') {
      matchStage.meetingId = meetingId;
    }

    const aggregationPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAssessments: { $sum: 1 },
          totalApproved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          totalPending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          totalBudget: {
            $sum: {
              $cond: [
                { $eq: ["$status", "approved"] },
                { $ifNull: ["$result.assistance.amount", 0] },
                0
              ]
            }
          },
          averageScore: { $avg: "$result.totalScore" },
          tier1Count: {
            $sum: { $cond: [{ $and: [{ $gte: ["$result.totalScore", 136] }, { $lte: ["$result.totalScore", 150] }] }, 1, 0] }
          },
          tier2Count: {
            $sum: { $cond: [{ $and: [{ $gte: ["$result.totalScore", 116] }, { $lte: ["$result.totalScore", 135] }] }, 1, 0] }
          },
          tier3Count: {
            $sum: { $cond: [{ $and: [{ $gte: ["$result.totalScore", 91] }, { $lte: ["$result.totalScore", 115] }] }, 1, 0] }
          },
          tier4Count: {
            $sum: { $cond: [{ $and: [{ $gte: ["$result.totalScore", 51] }, { $lte: ["$result.totalScore", 90] }] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $lte: ["$result.totalScore", 50] }, 1, 0] }
          }
        }
      }
    ];

    const stats = await Assessment.aggregate(aggregationPipeline);

    return NextResponse.json(stats.length > 0 ? stats[0] : {
      totalAssessments: 0,
      totalApproved: 0,
      totalPending: 0,
      totalBudget: 0,
      averageScore: 0,
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      tier4Count: 0,
      rejectedCount: 0
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return NextResponse.json({ error: 'Failed to calculate statistics' }, { status: 500 });
  }
}
