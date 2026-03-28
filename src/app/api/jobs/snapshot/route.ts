import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
const SNAPSHOT_TITLE = '__job_snapshot__';

function isDbConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P2010", "P1001"].includes(error.code);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    message.includes("server selection timeout") ||
    message.includes("replicasetnoprimary") ||
    message.includes("tls") ||
    message.includes("ssl")
  );
}

type SnapshotPayload = {
  jobs: unknown[];
  activities: unknown[];
  upcomingEvents: unknown[];
};

function parseSnapshot(raw: string | null): SnapshotPayload | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SnapshotPayload;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      upcomingEvents: Array.isArray(parsed.upcomingEvents) ? parsed.upcomingEvents : [],
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const snapshot = await db.post.findFirst({
      where: {
        authorId: userId,
        title: SNAPSHOT_TITLE,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        content: true,
      },
    });

    const state = parseSnapshot(snapshot?.content ?? null);
    return NextResponse.json({ state }, { status: 200 });
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check MongoDB Atlas access and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = (await request.json()) as { state?: SnapshotPayload };
    const state = body?.state;
    if (!state || !Array.isArray(state.jobs) || !Array.isArray(state.activities) || !Array.isArray(state.upcomingEvents)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const serialized = JSON.stringify({
      jobs: state.jobs,
      activities: state.activities,
      upcomingEvents: state.upcomingEvents,
    });

    const existing = await db.post.findFirst({
      where: {
        authorId: userId,
        title: SNAPSHOT_TITLE,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      await db.post.update({
        where: { id: existing.id },
        data: {
          content: serialized,
          published: false,
        },
      });
    } else {
      await db.post.create({
        data: {
          authorId: userId,
          title: SNAPSHOT_TITLE,
          content: serialized,
          published: false,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check MongoDB Atlas access and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
