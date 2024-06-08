import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="w-10 h-10 mr-2 animate-spin" />
    </div>
  );
}
