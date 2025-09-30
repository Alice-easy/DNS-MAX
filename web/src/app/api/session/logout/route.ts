import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse.json({ ok: true });
    // 清除cookies
    res.cookies.set("access_token", "", {
        httpOnly: true, secure: true, sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN, path: "/", maxAge: 0
    });
    res.cookies.set("refresh_token", "", {
        httpOnly: true, secure: true, sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN, path: "/", maxAge: 0
    });
    return res;
}
