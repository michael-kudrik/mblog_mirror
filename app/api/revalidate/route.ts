// // https://<your-site.com>/api/revalidate?secret=<token>
// // http://localhost:3000/api/revalidate?path=/&secret=token

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (path) {
    await revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } else {
    return NextResponse.json({ message: "Path is required" }, { status: 400 });
  }
}
