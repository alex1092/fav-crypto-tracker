"use client";

import BackChevronButton from "./BackChevronButton";
import { ModeToggle } from "./ModeToggle";
import SignInSignOutButton from "./SignInSignOutButton";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  const isHome = pathname === "/";

  const isAuth = pathname === "/auth";

  return (
    <nav className="flex justify-end items-center space-x-4 pt-2 pr-4">
      <div className="flex flex-1 justify-between items-center">
        {!isHome && <BackChevronButton />}
      </div>
      <ModeToggle />
      {!isAuth && <SignInSignOutButton />}
    </nav>
  );
};
