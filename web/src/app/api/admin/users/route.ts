import { NextRequest, NextResponse } from "next/server";
import {
    extractAccessToken,
    invalidApiUrlResponse,
    resolveApiUrl,
    unauthorizedResponse,
    upstreamUnavailableResponse,
} from "../../_helpers";

export async function GET(req: NextRequest) {
    const token = extractAccessToken(req);
    if (!token) {
        return unauthorizedResponse();
    }

    let targetUrl: string;
    try {
        targetUrl = resolveApiUrl("/admin/users");
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch (error) {
        return upstreamUnavailableResponse(error);
    }

    const text = await backendResponse.text();
    return new NextResponse(text, {
        status: backendResponse.status,
        headers: {
            "content-type": backendResponse.headers.get("content-type") ?? "application/json",
        },
    });
}
