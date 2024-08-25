import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY;
  const apiSecret = process.env.REACT_APP_STREAM_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Stream credentials are not set" }, { status: 500 });
  }

  const client = StreamChat.getInstance(apiKey, apiSecret);

  try {
    const token = client.createToken(userId);

    return NextResponse.json({ userToken: token });
  } catch (error) {
    console.error('Error creating user token:', error);
    return NextResponse.json({ error: "Failed to create user token" }, { status: 500 });
  }
}