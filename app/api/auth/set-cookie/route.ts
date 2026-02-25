import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request to set cookie:", { hasToken: !!body.token });

    const { token } = body;

    if (!token) {
      console.error("No token provided in request");
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ 
      success: true,
      message: "Cookie set successfully" 
    });

    // Set cookie with proper options
    response.cookies.set({
      name: "employee_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Cookie set successfully");

    return response;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json(
      { error: "Failed to set cookie", details: String(error) },
      { status: 500 }
    );
  }
}