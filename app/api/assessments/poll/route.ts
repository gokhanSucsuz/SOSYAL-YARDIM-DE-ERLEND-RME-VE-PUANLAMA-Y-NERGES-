import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import { getSession } from "@/lib/auth";

/**
 * GET /api/assessments/poll
 * Hafif polling endpoint — tam veri yerine sadece son güncelleme zamanı ve
 * toplam kayıt sayısını döner. Frontend bunu kıyaslayarak tam yenileme yapar.
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const personnelId = searchParams.get("personnelId");
    const query = personnelId ? { personnelId } : {};

    const [total, latest] = await Promise.all([
      Assessment.countDocuments(query),
      Assessment.findOne(query).sort({ updatedAt: -1 }).select("updatedAt id").lean(),
    ]);

    const lastUpdatedAt = (latest as any)?.updatedAt ?? null;

    return NextResponse.json(
      { total, lastUpdatedAt },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json({ error: "Polling basarisiz" }, { status: 500 });
  }
}
