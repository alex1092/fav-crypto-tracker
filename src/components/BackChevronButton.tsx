"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackChevronButton() {
  const router = useRouter();
  return (
    <ChevronLeft
      className="w-10 h-10 absolute left-0 top-0 sm:left-10 sm:top-10 hover:opacity-50"
      onClick={() => router.back()}
    />
  );
}
