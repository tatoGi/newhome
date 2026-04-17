import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

type RevalidateBody = {
  paths?: unknown;
  tags?: unknown;
};

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET is not configured' },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get('x-revalidate-secret') ||
    request.nextUrl.searchParams.get('secret');

  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const paths = Array.isArray(body.paths)
    ? body.paths.map((v) => String(v ?? '').trim()).filter(Boolean)
    : [];
  const tags = Array.isArray(body.tags)
    ? body.tags.map((v) => String(v ?? '').trim()).filter(Boolean)
    : [];

  if (paths.length === 0 && tags.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Provide at least one path or tag' },
      { status: 400 },
    );
  }

  for (const path of paths) {
    revalidatePath(path);
  }
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ ok: true, revalidated: { paths, tags }, at: Date.now() });
}
