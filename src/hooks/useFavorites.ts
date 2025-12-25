import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  flower_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (flowerId: string) => {
      return favorites.some((fav) => fav.flower_id === flowerId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (flowerId: string, flowerName?: string) => {
      if (!user) {
        toast({
          title: "உள்நுழைக (Login Required)",
          description: "Please login to add favorites",
          variant: "destructive",
        });
        return;
      }

      const isCurrentlyFavorite = isFavorite(flowerId);

      try {
        if (isCurrentlyFavorite) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("flower_id", flowerId);

          if (error) throw error;

          setFavorites((prev) =>
            prev.filter((fav) => fav.flower_id !== flowerId)
          );
          toast({
            title: "நீக்கப்பட்டது (Removed)",
            description: `${flowerName || "Item"} removed from favorites`,
          });
        } else {
          const { data, error } = await supabase
            .from("favorites")
            .insert({ user_id: user.id, flower_id: flowerId })
            .select()
            .single();

          if (error) throw error;

          setFavorites((prev) => [...prev, data]);
          toast({
            title: "சேர்க்கப்பட்டது (Added)",
            description: `${flowerName || "Item"} added to favorites`,
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast({
          title: "பிழை (Error)",
          description: "Failed to update favorites",
          variant: "destructive",
        });
      }
    },
    [user, isFavorite]
  );

  const favoriteFlowerIds = favorites.map((fav) => fav.flower_id);

  return {
    favorites,
    favoriteFlowerIds,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
};
