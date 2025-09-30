import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const access = req.cookies.get("access_token")?.value;
    const r = await fetch(`${process.env.PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${access ?? ""}` },
        cache: "no-store",
    });
    return new NextResponse(await r.text(), { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}
