import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return new NextResponse("OK");
}
