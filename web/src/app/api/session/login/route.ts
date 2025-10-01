import { NextRequest, NextResponse } from "next/server";
import { forwardSetCookies, resolveCookieDomain, shouldUseSecureCookie } from "../../_helpers";

const DEFAULT_API_BASE = "http://localhost:8000";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const apiBase = process.env.PUBLIC_API_URL
        ?? process.env.NEXT_PUBLIC_API_URL
        ?? DEFAULT_API_BASE;

    let targetUrl: string;
    try {
        targetUrl = new URL("/auth/login", apiBase).toString();
    } catch (error) {
        console.error("Invalid PUBLIC_API_URL", error);
        return new NextResponse("Invalid API base URL", { status: 500 });
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error("Login request failed", error);
        return new NextResponse("上游接口不可达", { status: 502 });
    }

    const fallbackClone = backendResponse.clone();
    let fallbackJson: Record<string, unknown> | null = null;
    if (backendResponse.ok) {
        try {
            fallbackJson = await fallbackClone.json();
        } catch {
            // 忽略非JSON响应
            fallbackJson = null;
        }
    }

    const bodyText = await backendResponse.text();
    const contentType = backendResponse.headers.get("content-type") ?? "application/json";
    const res = new NextResponse(bodyText, {
        status: backendResponse.status,
        headers: {
            "content-type": contentType,
        },
    });

    const forwarded = forwardSetCookies(backendResponse, res);

    if (!forwarded && backendResponse.ok && fallbackJson) {
        const accessToken = typeof fallbackJson["access_token"] === "string" ? fallbackJson["access_token"] as string : null;
        const refreshToken = typeof fallbackJson["refresh_token"] === "string" ? fallbackJson["refresh_token"] as string : null;
        if (accessToken && refreshToken) {
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

            const accessTtlMinutes = Number(process.env.ACCESS_TOKEN_TTL_MIN ?? "30");
            const refreshTtlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "14");

            res.cookies.set("access_token", accessToken, {
                ...baseCookieOptions,
                maxAge: Math.max(1, Math.floor(60 * accessTtlMinutes)),
            });

            res.cookies.set("refresh_token", refreshToken, {
                ...baseCookieOptions,
                maxAge: Math.max(1, Math.floor(60 * 60 * 24 * refreshTtlDays)),
            });
        }
    }

    return res;
}
