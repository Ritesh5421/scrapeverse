import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await decrypt(token);

    if (!payload) {
      return NextResponse.json({ user: null });
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const preferences = user.preferences
      ? {
          interests: JSON.parse(user.preferences.interests),
          experienceLevel: user.preferences.experienceLevel,
          goals: JSON.parse(user.preferences.goals),
          languages: JSON.parse(user.preferences.languages),
          customLanguages: JSON.parse(user.preferences.customLanguages),
          timeCommitment: user.preferences.timeCommitment,
        }
      : null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        preferences,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
}
