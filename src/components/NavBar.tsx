"use client";

import Link from "next/link";
import BackChevronButton from "./BackChevronButton";
import { ModeToggle } from "./ModeToggle";
import SignInSignOutButton from "./SignInSignOutButton";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const NavBar = () => {
  const user = useUserStore((state) => state.user);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuth = pathname === "/auth";

  return (
    <nav className="flex justify-end items-center space-x-4 pt-2 pr-4">
      <div className="flex flex-1 justify-between items-center">
        {!isHome && <BackChevronButton />}
      </div>

      {user && <Link href="/portfolio">Portfolio</Link>}
      <ModeToggle />
      {!isAuth && <SignInSignOutButton />}
    </nav>
  );
};
