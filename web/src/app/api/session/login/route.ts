import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const r = await fetch(`${process.env.PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!r.ok) {
        const text = await r.text();
        return new NextResponse(text, { status: r.status });
    }
    const data = await r.json(); // {access_token, refresh_token}
    const res = NextResponse.json({ ok: true });
    // httpOnly, Secure, SameSite=Lax，作用域全站
    res.cookies.set("access_token", data.access_token, {
        httpOnly: true, secure: true, sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN, path: "/", maxAge: 60 * Number(process.env.ACCESS_TOKEN_TTL_MIN ?? "30")
    });
    res.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true, secure: true, sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN, path: "/", maxAge: 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "14")
    });
    return res;
}
