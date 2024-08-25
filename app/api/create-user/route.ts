// import { NextResponse } from "next/server";
// import { StreamChat } from "stream-chat";
//
// export async function POST(request: Request) {
//   console.log("POST /api/create-user");
//
//   // 1 get the user ID we need as a parameter
//   const requestBody = await request.json();
//   const userId = requestBody.userId;
//
//   // 2 send user ID and any other required data to Stream Chat backend
//   const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY || "Set API Key";
//   const apiSecret = process.env.REACT_APP_STREAM_SECRET || "Set API Secret";
//   const client = StreamChat.getInstance(apiKey, apiSecret);
//
//   // 3 generate a user token
//   const upsertResponse = await client.upsertUser({
//     id: userId,
//     role: "user",
//   });
//
//   const token = client.createToken(userId);
//
//   // URL to redirect to after sign in process completes
//   return NextResponse.json({
//     userToken: token,
//   });
// }

// import { NextResponse } from "next/server";
// import { StreamChat } from "stream-chat";
// import { auth } from "@clerk/nextjs";
//
// export async function POST(request: Request) {
//   const { userId } = await auth();
//
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//
//   const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY || "Set API Key";
//   const apiSecret = process.env.REACT_APP_STREAM_SECRET || "Set API Secret";
//   const client = StreamChat.getInstance(apiKey, apiSecret);
//
//   const upsertResponse = await client.upsertUser({
//     id: userId,
//     role: "user",
//   });
//
//   const token = client.createToken(userId);
//
//   return NextResponse.json({
//     userToken: token,
//   });
// }

import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { auth, currentUser } from "@clerk/nextjs";

export async function POST(request: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_STREAM_KEY || "Set API Key";
  const apiSecret = process.env.REACT_APP_STREAM_SECRET || "Set API Secret";
  const client = StreamChat.getInstance(apiKey, apiSecret);

  const upsertResponse = await client.upsertUser({
    id: userId,
    name: user.emailAddresses[0].emailAddress,
    image: user.imageUrl,
    role: "user",
  });

  const token = client.createToken(userId);

  return NextResponse.json({
    userToken: token,
  });
}