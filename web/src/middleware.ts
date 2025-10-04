import { NextRequest, NextResponse } from "next/server";
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (!PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}
