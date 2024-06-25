"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackChevronButton() {
  const router = useRouter();
  return (
    <ChevronLeft
      className="w-10 h-10 ml-5 hover:opacity-50"
      onClick={() => router.back()}
    />
  );
}
