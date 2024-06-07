"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function SignInSignOutButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    fetchUser();
  }, []);

  const onsubmit = () => {
    const supabase = createClient();
    if (user) {
      supabase.auth.signOut();
      setUser(null);
    } else {
      router.push("/auth");
    }
  };

  return (
    <Button onClick={() => onsubmit()}>{user ? "Sign out" : "Sign in"}</Button>
  );
}
