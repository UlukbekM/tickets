import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);

    const apiUrl = process.env.BACKEND + `/add-event-by-email/`;

    const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: body.email,  // Send email as a separate field
            event: {            // Nest event details inside an event object
                id: body.id,
                artist: body.artist,
                date: body.date,
                city: body.city,
                country: body.country,
                venue: body.venue,
                artistImage: body.artistImage,
                time: body.time,
                url: body.url
            },
        }),
    });

    const data = await apiResponse.json();

    return NextResponse.json({
        // message: "Data sent successfully",
        backendResponse: data,
    });
}
