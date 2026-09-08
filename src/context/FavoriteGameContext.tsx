import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { Game } from "../interfaces/Game.interface"; // Ajusta tu ruta si es necesario

interface FavoriteGameContextProps {
  favorites: Game[];
  favoriteCount: number;
  isFavorite: (hero: Game) => boolean;
  toggleFavorite: (hero: Game) => void;
}

export const FavoriteHeroContext = createContext<
  FavoriteGameContextProps | undefined
>(undefined);

interface FavoriteHeroProviderProps {
  children: ReactNode;
}

export const FavoriteHeroProvider = ({
  children,
}: FavoriteHeroProviderProps) => {
  const [favorites, setFavorites] = useState<Game[]>(() => {
    const guardados = localStorage.getItem("mis_favoritos_arcade");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem("mis_favoritos_arcade", JSON.stringify(favorites));
  }, [favorites]);

  const favoriteCount = favorites.length;

  const isFavorite = (hero: Game): boolean => {
    return favorites.some((fav) => fav.id === hero.id);
  };

  const toggleFavorite = (hero: Game) => {
    if (isFavorite(hero)) {
      setFavorites(favorites.filter((fav) => fav.id !== hero.id));
    } else {
      setFavorites([...favorites, hero]);
    }
  };

  return (
    <FavoriteHeroContext.Provider
      value={{
        favorites,
        favoriteCount,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoriteHeroContext.Provider>
  );
};

// Custom Hook para consumir el contexto de manera limpia y segura
export const useFavorites = () => {
  const context = useContext(FavoriteHeroContext);
  if (!context) {
    throw new Error(
      "useFavorites debe ser usado dentro de un FavoriteHeroProvider",
    );
  }
  return context;
};
