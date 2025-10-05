import { NextRequest, NextResponse } from "next/server";
import {
    extractAccessToken,
    invalidApiUrlResponse,
    resolveApiUrl,
    unauthorizedResponse,
    upstreamUnavailableResponse,
} from "../_helpers";

interface AllocationRequestPayload {
    domain_id: number;
    subdomain: string;
    type: string;
    value: string;
    ttl: number;
}

export async function POST(req: NextRequest) {
    const token = extractAccessToken(req);
    if (!token) {
        return unauthorizedResponse();
    }

    const payload: AllocationRequestPayload = await req.json();

    let targetUrl: string;
    try {
        targetUrl = resolveApiUrl("/domains/allocations");
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: "POST",
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
