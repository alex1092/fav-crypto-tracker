"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";

export default function SignInSignOutButton() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      useUserStore.getState().setUser(user);
    }

    fetchUser();
  }, []);

  const onsubmit = () => {
    const supabase = createClient();
    if (user) {
      supabase.auth.signOut();
      useUserStore.getState().setUser(null);
      router.refresh();
    } else {
      router.push("/auth");
    }
  };

  return (
    <Button onClick={() => onsubmit()}>{user ? "Sign out" : "Sign in"}</Button>
  );
}
