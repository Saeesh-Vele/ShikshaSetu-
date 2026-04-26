import { NextResponse } from "next/server";

// Simple in-memory mock store for demo
let colleges = [
  { id: 1, name: "Indian Institute of Technology (IIT), Delhi", location: "Delhi", streams: ["Engineering"] },
  { id: 2, name: "National Institute of Technology (NIT), Trichy", location: "Tamil Nadu", streams: ["Engineering"] }
];

export async function GET() {
  try {
    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching colleges" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newCollege = { id: colleges.length + 1, ...body };
    colleges.push(newCollege);
    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding college" }, { status: 400 });
  }
}