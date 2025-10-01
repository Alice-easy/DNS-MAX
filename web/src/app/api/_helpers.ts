import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API_BASE = "http://localhost:8000";

export function resolveApiBase(): string {
    return process.env.PUBLIC_API_URL
        ?? process.env.NEXT_PUBLIC_API_URL
        ?? DEFAULT_API_BASE;
}

export function resolveApiUrl(path: string): string {
    return new URL(path, resolveApiBase()).toString();
}

export function extractAccessToken(req: NextRequest): string | null {
    return req.cookies.get("access_token")?.value ?? null;
}

export function unauthorizedResponse(): NextResponse {
    return NextResponse.json({ detail: "未登录" }, { status: 401 });
}

export function invalidApiUrlResponse(error: unknown): NextResponse {
    console.error("Invalid API base URL", error);
    return NextResponse.json({ detail: "Invalid API base URL" }, { status: 500 });
}

export function upstreamUnavailableResponse(error: unknown): NextResponse {
    console.error("Upstream request failed", error);
    return NextResponse.json({ detail: "上游接口不可达" }, { status: 502 });
}

export function forwardSetCookies(from: Response, to: NextResponse): boolean {
    const headers = from.headers as Headers & { getSetCookie?: () => string[] };
    const setCookies: string[] = headers.getSetCookie ? headers.getSetCookie() : [];

    if (setCookies.length > 0) {
        setCookies.forEach(cookie => {
            to.headers.append("Set-Cookie", cookie);
        });
        return true;
    }

    const single = headers.get("set-cookie");
    if (single) {
        to.headers.append("Set-Cookie", single);
        return true;
    }

    return false;
}

export function buildBackendAuthHeaders(req: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {};
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
    }

    const incomingAuth = req.headers.get("authorization");
    if (incomingAuth) {
        headers["Authorization"] = incomingAuth;
    }

    return headers;
}

export function shouldUseSecureCookie(req: NextRequest): boolean {
    const override = process.env.COOKIE_SECURE?.toLowerCase();
    if (override === "true") return true;
    if (override === "false") return false;

    const forwardedProto = req.headers.get("x-forwarded-proto");
    if (forwardedProto) {
        return forwardedProto.split(",")[0]?.trim().toLowerCase() === "https";
    }

    return req.nextUrl.protocol === "https:";
}

export function resolveCookieDomain(): string | undefined {
    const domain = process.env.COOKIE_DOMAIN?.trim();
    if (!domain || domain === "localhost") {
        return undefined;
    }
    return domain;
}
