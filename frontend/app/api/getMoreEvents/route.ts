import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const nextUrl = searchParams.get("nextUrl");

    if (!nextUrl) {
        return NextResponse.json({ message: 'Next URL is required' }, { status: 400 });
    }

    try {
        const apiUrl = `https://app.ticketmaster.com${nextUrl}&apikey=${process.env.TICKETMASTER_KEY}`;
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json({ message: data.message || 'Error fetching events' }, { status: apiResponse.status });
        }

        return NextResponse.json({
            apiData: data
        });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
