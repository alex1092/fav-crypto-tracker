'use client'

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/auth-js";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type FavoriteCryptoButtonProps = {
  coinId: string;
  userId: User['id'];
}

export default function FavoriteCryptoButton({ coinId, userId }: FavoriteCryptoButtonProps) {
  const [favoriteCoins, setFavoriteCoins] = useState<any[] | null>(null);


const supabase = createClient();

const fetchFavoriteCoins = async () => {
  let { data: favorite_coins, error } = await supabase
  .from('favorite_coins')
  .select('*')
  .eq('user_id', userId)

  setFavoriteCoins(favorite_coins)
}

useEffect(() => {
  fetchFavoriteCoins();
}, [userId]);


  return <Star />;
}