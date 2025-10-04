import { NextRequest, NextResponse } from "next/server";
import { resolveCookieDomain, shouldUseSecureCookie } from "../../_helpers";

export async function POST(req: NextRequest) {
    const res = NextResponse.json({ ok: true });

    const secure = shouldUseSecureCookie(req);
    const cookieDomain = resolveCookieDomain();
    const baseCookieOptions: Parameters<typeof res.cookies.set>[2] = {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
    };

    if (cookieDomain) {
        baseCookieOptions.domain = cookieDomain;
    }

    res.cookies.set("access_token", "", {
        ...baseCookieOptions,
        maxAge: 0,
    });

    res.cookies.set("refresh_token", "", {
        ...baseCookieOptions,
        maxAge: 0,
    });

    return res;
}
