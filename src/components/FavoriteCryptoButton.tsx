"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-js";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

type FavoriteCryptoButtonProps = {
  coinId: string;
  userId: User["id"];
};

export default function FavoriteCryptoButton({
  coinId,
  userId,
}: FavoriteCryptoButtonProps) {
  const supabase = createClient();
  const { toast } = useToast();

  const [loadingFavoriteCoin, setLoadingFavoriteCoin] = useState(false);

  const {
    data: favoriteCoins,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favoriteCoins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorite_coins")
        .select("coin_id")
        .eq("user_id", userId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }


  const addFavoriteCoin = async () => {
    setLoadingFavoriteCoin(true);

    let newCoinIdArray = [];

    if (favoriteCoins?.length === 0) {
      newCoinIdArray = [coinId];
      const { error } = await supabase
        .from("favorite_coins")
        .insert({ coin_id: newCoinIdArray, user_id: userId })
        .select();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Coin added to favorites",
        });
        refetch();
      }
      setLoadingFavoriteCoin(false);
      return;
    }

    if (favoriteCoins?.some((coin) => coin.coin_id.includes(coinId))) {
      newCoinIdArray = favoriteCoins[0].coin_id.filter((id: string) => id !== coinId);
      const { error } = await supabase
        .from("favorite_coins")
        .update({ coin_id: newCoinIdArray })
        .eq("user_id", userId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Coin removed from favorites",
        });
        refetch();
      }
      setLoadingFavoriteCoin(false);
      return;
    }

    newCoinIdArray = [coinId, ...favoriteCoins?.[0]?.coin_id];
    const { error } = await supabase
      .from("favorite_coins")
      .update({ coin_id: newCoinIdArray })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Coin added to favorites",
      });
      refetch();
    }
    setLoadingFavoriteCoin(false);
  };

  return (
    <>
      {loadingFavoriteCoin ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <Star
          onClick={addFavoriteCoin}
      color={
        favoriteCoins?.some((coin) => coin.coin_id.includes(coinId))
          ? "yellow"
          : undefined
      }
    />
    )}
    </>
  );
}
