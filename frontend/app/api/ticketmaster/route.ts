import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.TICKETMASTER_KEY}&keyword=${encodeURIComponent(body.input)}&locale=*&sort=date,asc`; // Example API
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    return NextResponse.json({
        apiData: data
    });
}
