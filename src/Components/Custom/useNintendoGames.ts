import { useState, useEffect, useRef } from "react";
import type { Game } from "../../interfaces/Game.interface";

type NintendoCache = Record<string, Game[]>;

interface UseNintendoGamesProps {
  urlBase: string;
  apiKey: string;
  search: string;
}

export function useNintendoGames({
  urlBase,
  apiKey,
  search,
}: UseNintendoGamesProps) {
  const [nintendoGames, setNintendoGames] = useState<Game[]>([]);
  const [loadingNintendo, setLoadingNintendo] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(""); // <-- Estado para el año seleccionado

  const nintendoCache = useRef<NintendoCache>({});
  const searchTimerRef = useRef<number | null>(null);

  const fetchNintendoGames = async (
    textoBuscar = "",
    anioFiltro = selectedYear,
  ) => {
    const queryLimpia = textoBuscar.trim().toLowerCase();
    // Llave única para la caché que combina el texto de búsqueda y el año activo
    const cacheKey = `${queryLimpia}_${anioFiltro || "all"}`;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (nintendoCache.current[cacheKey]) {
      console.log(
        `Búsqueda de Nintendo (Filtros: "${cacheKey}") obtenida desde el caché 🚀`,
      );
      setNintendoGames(nintendoCache.current[cacheKey]);
      setLoadingNintendo(false);
      return;
    }

    setLoadingNintendo(true);

    try {
      const params = new URLSearchParams({
        key: apiKey,
        parent_platforms: "7", // ID de Nintendo en RAWG
      });

      if (textoBuscar.trim()) {
        params.append("search", textoBuscar);
      }

      // Si hay un año seleccionado, agregamos el rango de fechas compatible con RAWG
      if (anioFiltro) {
        const startDate = `${anioFiltro}-01-01`;
        const endDate = `${anioFiltro}-12-31`;
        params.append("dates", `${startDate},${endDate}`);
      }

      const response = await fetch(`${urlBase}?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error al obtener los videojuegos de Nintendo");
      }

      const data = await response.json();
      const resultados = data.results || [];

      nintendoCache.current[cacheKey] = resultados;

      setNintendoGames(resultados);
    } catch (error) {
      console.error("Error al traer los juegos de Nintendo:", error);
      nintendoCache.current[cacheKey] = [];
      setNintendoGames([]);
    } finally {
      setLoadingNintendo(false);
    }
  };

  // Funciones para manejar el filtro por año
  const filtrarPorAnio = (anio: string) => {
    setSelectedYear(anio);
    if (search.trim() !== "") {
      setLoadingNintendo(true);
    }
    fetchNintendoGames(search, anio);
  };

  const limpiarFiltroAnio = () => {
    setSelectedYear("");
    fetchNintendoGames(search, "");
  };

  useEffect(() => {
    if (search.trim() !== "") {
      setLoadingNintendo(true);
    }

    searchTimerRef.current = window.setTimeout(() => {
      fetchNintendoGames(search, selectedYear);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [search]);

  return {
    nintendoGames,
    loadingNintendo,
    fetchNintendoGames,
    selectedYear,
    filtrarPorAnio,
    limpiarFiltroAnio,
  };
}
