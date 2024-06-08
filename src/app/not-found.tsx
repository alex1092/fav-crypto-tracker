import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h2 className="text-6xl font-bold  mb-4">404 - Not Found</h2>
      <p className="text-xl opacity-50 mb-8">
        Oops! The page you are looking for could not be found.
      </p>

      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
