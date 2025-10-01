import { NextRequest, NextResponse } from "next/server";
import {
    extractAccessToken,
    invalidApiUrlResponse,
    resolveApiUrl,
    unauthorizedResponse,
    upstreamUnavailableResponse,
} from "../../../../_helpers";

export async function POST(req: NextRequest, { params }: { params: { allocationId: string } }) {
    const token = extractAccessToken(req);
    if (!token) {
        return unauthorizedResponse();
    }

    let targetUrl: string;
    try {
        targetUrl = resolveApiUrl(`/admin/allocations/${params.allocationId}/approve`);
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
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
