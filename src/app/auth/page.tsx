"use client";

import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<
    z.infer<typeof signInSchema> | z.infer<typeof signUpSchema>
  >({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof signInSchema> | z.infer<typeof signUpSchema>
  ) {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Check your email for a confirmation link",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        router.push("/");
      }
    }
  }

  return (
    <main className="flex flex-col items-center gap-4 justify-center h-screen">
      <h1 className="text-2xl font-bold">
        Sign in to see your favorite crypto coins
      </h1>
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>{isSignUp ? "Sign up" : "Sign in"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="user@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Email is required" }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Password is required" }}
              />
              {isSignUp && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm Password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{ required: "Confirm Password is required" }}
                />
              )}
              <div className="flex gap-2">
                <Button type="submit">
                  {isSignUp ? "Sign up" : "Sign in"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    form.reset();
                  }}
                >
                  {isSignUp ? "Sign in instead" : "Sign up instead"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
