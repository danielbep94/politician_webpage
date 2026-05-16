import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import {
  buildSanityTags,
  getSanityRevalidationPaths,
  getSanityRevalidationTags
} from "@/lib/sanity/tags";

type RevalidatePayload = {
  _id?: string;
  _type?: string;
  slug?: string | { current?: string | null } | null;
  tags?: string[];
  paths?: string[];
};

function getRequestSecret(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  return (
    bearerToken ||
    request.headers.get("x-revalidate-secret") ||
    request.nextUrl.searchParams.get("secret")
  );
}

function getSlugValue(slug: RevalidatePayload["slug"]) {
  if (!slug) {
    return null;
  }

  if (typeof slug === "string") {
    return slug;
  }

  return slug.current || null;
}

function getRequestedTags(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");

  return tag ? buildSanityTags([tag]) : [];
}

function revalidateTags(tags: string[]) {
  tags.forEach((tag) => {
    revalidateTag(tag);
  });
}

function revalidatePaths(paths: string[]) {
  paths.forEach((path) => {
    revalidatePath(path);
  });
}

export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        message: "REVALIDATE_SECRET no está configurado."
      },
      { status: 500 }
    );
  }

  const providedSecret = getRequestSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json(
      {
        ok: false,
        message: "No autorizado."
      },
      { status: 401 }
    );
  }

  const tags = getRequestedTags(request);

  if (tags.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Proporciona al menos un tag con ?tag=..."
      },
      { status: 400 }
    );
  }

  revalidateTags(tags);

  return NextResponse.json({
    ok: true,
    mode: "manual",
    revalidated: {
      tags
    },
    now: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        message: "REVALIDATE_SECRET no está configurado."
      },
      { status: 500 }
    );
  }

  const providedSecret = getRequestSecret(request);

  if (providedSecret !== secret) {
    return NextResponse.json(
      {
        ok: false,
        message: "No autorizado."
      },
      { status: 401 }
    );
  }

  let payload: RevalidatePayload;

  try {
    payload = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "El body debe ser JSON válido."
      },
      { status: 400 }
    );
  }

  const slug = getSlugValue(payload.slug);
  const derivedTags = getSanityRevalidationTags(payload._type, slug);
  const customTags = payload.tags?.length ? buildSanityTags(payload.tags) : [];
  const tags = Array.from(new Set([...derivedTags, ...customTags]));
  const paths = Array.from(
    new Set(
      [...(payload.paths ?? []), ...getSanityRevalidationPaths(payload._type, slug)].filter(
        Boolean
      )
    )
  );

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "No se pudo derivar ningún tag o path para revalidar."
      },
      { status: 400 }
    );
  }

  revalidateTags(tags);
  revalidatePaths(paths);

  return NextResponse.json({
    ok: true,
    revalidated: {
      tags,
      paths
    },
    document: {
      id: payload._id ?? null,
      type: payload._type ?? null,
      slug
    },
    now: new Date().toISOString()
  });
}
