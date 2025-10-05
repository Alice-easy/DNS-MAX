import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    // Skip middleware during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.next();
    }
    
    if (!PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();
    
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
