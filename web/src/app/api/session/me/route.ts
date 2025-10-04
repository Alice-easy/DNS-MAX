import { NextRequest, NextResponse } from "next/server";
import {
    buildBackendAuthHeaders,
    forwardSetCookies,
    invalidApiUrlResponse,
    resolveApiUrl,
    unauthorizedResponse,
    upstreamUnavailableResponse,
} from "../../_helpers";

export async function GET(req: NextRequest) {
    const headers = buildBackendAuthHeaders(req);

    if (!headers["Cookie"] && !headers["Authorization"]) {
        return unauthorizedResponse();
    }

    let targetUrl: string;
    try {
        targetUrl = resolveApiUrl("/users/me");
    } catch (error) {
        return invalidApiUrlResponse(error);
    }

    let backendResponse: Response;
    try {
        backendResponse = await fetch(targetUrl, {
            headers,
            cache: "no-store",
        });
    } catch (error) {
        return upstreamUnavailableResponse(error);
    }

    const bodyText = await backendResponse.text();
    const contentType = backendResponse.headers.get("content-type");
    const responseHeaders: Record<string, string> = {};
    if (contentType) {
        responseHeaders["content-type"] = contentType;
    }

    const res = new NextResponse(bodyText, {
        status: backendResponse.status,
        headers: responseHeaders,
    });

    forwardSetCookies(backendResponse, res);

    return res;
}
