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
        targetUrl = resolveApiUrl("/admin/config");
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

export async function PATCH(req: NextRequest) {
    const token = extractAccessToken(req);
    if (!token) {
        return unauthorizedResponse();
    }

    const payload = await req.json();

    let targetUrl: string;
    try {
        targetUrl = resolveApiUrl("/admin/config");
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
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
