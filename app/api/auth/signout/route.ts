export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.delete("auth");

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}