import { NextResponse } from "next/server";

export type OnlineDesignItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  photographer?: string;
  tags: string[];
};

export async function GET() {
  return NextResponse.json({
    items: [],
    source: "admin-only",
  });
}