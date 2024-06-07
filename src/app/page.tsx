import SignInSignOutButton from "@/components/SignInSignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <nav className="flex justify-end p-4 absolute top-0 right-0">
        <SignInSignOutButton />
      </nav>
      <div className="flex flex-col items-center justify-start  h-screen">
        <Image
          src="/wojak.png"
          alt="Making it rain"
          width={150}
          height={150}
          className="mt-10 pb-3"
        />
        <h1 className="text-4xl font-bold">Crypto tracker</h1>
        <p className="text-2xl font-bold">Track your favorite coins</p>
        <div className="flex flex-row items-center justify-center mt-5 gap-2">
          <Input placeholder="Search a coin" className="w-[340px]" />
          <Button className="w-[100px]">Search</Button>
        </div>
      </div>
    </main>
  );
}
