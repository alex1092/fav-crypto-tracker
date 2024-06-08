import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import SignInSignOutButton from "./SignInSignOutButton";

export const NavBar = () => {
  return (
    <nav className="flex justify-end items-center space-x-4 pt-2 pr-4">
      <div className="flex items-center space-x-7">
        <Link className="hover:opacity-50" href="/">
          Home
        </Link>
        <Link className="hover:opacity-50" href="/favorites">
          Favorites
        </Link>
      </div>
      <ModeToggle />
      <SignInSignOutButton />
    </nav>
  );
};
