import { useState, useEffect, useRef } from "react";
import type { Game } from "../../interfaces/Game.interface";

type PlayStationCache = Record<string, Game[]>;

interface UsePlayStationGamesProps {
  urlBase: string;
  apiKey: string;
  search: string;
}

export function usePlayStationGames({
  urlBase,
  apiKey,
  search,
}: UsePlayStationGamesProps) {
  const [playStationGames, setPlayStationGames] = useState<Game[]>([]);
  const [loadingPlayStation, setLoadingPlayStation] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(""); // <-- Nuevo estado para el año seleccionado

  const playStationCache = useRef<PlayStationCache>({});
  const searchTimerRef = useRef<number | null>(null);

  const fetchPlayStationGames = async (
    textoBuscar = "",
    anioFiltro = selectedYear,
  ) => {
    const queryLimpia = textoBuscar.trim().toLowerCase();
    // Creamos una llave única para el caché que combine la búsqueda y el año
    const cacheKey = `${queryLimpia}_${anioFiltro || "all"}`;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (playStationCache.current[cacheKey]) {
      console.log(
        `Búsqueda de PlayStation (Filtros: "${cacheKey}") obtenida desde el caché 🚀`,
      );
      setPlayStationGames(playStationCache.current[cacheKey]);
      setLoadingPlayStation(false);
      return;
    }

    setLoadingPlayStation(true);
    try {
      const params = new URLSearchParams({
        key: apiKey,
        parent_platforms: "2", // ID de PlayStation en RAWG
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

      if (!response.ok)
        throw new Error("Error al obtener los videojuegos de PlayStation");

      const data = await response.json();
      const resultados = data.results || [];

      playStationCache.current[cacheKey] = resultados;

      setPlayStationGames(resultados);
    } catch (error) {
      console.error("Error al traer los juegos de PlayStation:", error);
      playStationCache.current[cacheKey] = [];
      setPlayStationGames([]);
    } finally {
      setLoadingPlayStation(false);
    }
  };

  // Función para cambiar de año y refrescar la lista automáticamente
  const filtrarPorAnio = (anio: string) => {
    setSelectedYear(anio);
    if (search.trim() !== "") {
      setLoadingPlayStation(true);
    }
    fetchPlayStationGames(search, anio);
  };

  // Limpiar filtro de año
  const limpiarFiltroAnio = () => {
    setSelectedYear("");
    fetchPlayStationGames(search, "");
  };

  useEffect(() => {
    if (search.trim() !== "") {
      setLoadingPlayStation(true);
    }

    searchTimerRef.current = window.setTimeout(() => {
      fetchPlayStationGames(search, selectedYear);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [search]);

  return {
    playStationGames,
    loadingPlayStation,
    fetchPlayStationGames,
    selectedYear,
    filtrarPorAnio,
    limpiarFiltroAnio,
  };
}
