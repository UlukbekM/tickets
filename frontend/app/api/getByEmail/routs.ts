import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Extract email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiUrl = `${process.env.BACKEND}/get-item-by-email/?email=${encodeURIComponent(email)}`;

    try {
        // Send a GET request to the backend
        const apiResponse = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            return NextResponse.json({ error: errorData.error || "Failed to fetch data from backend" }, { status: apiResponse.status });
        }

        const data = await apiResponse.json();

        return NextResponse.json({
            message: "Data retrieved successfully",
            item: data, // Return the fetched item
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
