import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real application, you would fetch this data from your database
  // For this example, we'll return mock data
  const userData = {
    id: params.id,
    name: `User ${params.id}`,
    image: `https://api.dicebear.com/6.x/initials/svg?seed=${params.id}`,
  };

  return NextResponse.json(userData);
}