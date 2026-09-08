import { useState, useEffect, useRef } from "react";
import type { Game } from "../../interfaces/Game.interface";

type XboxCache = Record<string, Game[]>;

interface UseXboxGamesProps {
  urlBase: string;
  apiKey: string;
  search: string;
}

export function useXboxGames({ urlBase, apiKey, search }: UseXboxGamesProps) {
  const [xboxGames, setXboxGames] = useState<Game[]>([]);
  const [loadingXbox, setLoadingXbox] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(""); // <-- Estado para el año seleccionado

  const xboxCache = useRef<XboxCache>({});
  const searchTimerRef = useRef<number | null>(null);

  const fetchXboxGames = async (
    textoBuscar = "",
    anioFiltro = selectedYear,
  ) => {
    const queryLimpia = textoBuscar.trim().toLowerCase();
    // Llave única que combina la búsqueda de texto y el año actual
    const cacheKey = `${queryLimpia}_${anioFiltro || "all"}`;

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Si ya está en caché, lo devolvemos al instante sin hacer fetch 🚀
    if (xboxCache.current[cacheKey]) {
      console.log(
        `Búsqueda de Xbox (Filtros: "${cacheKey}") obtenida desde el caché 🚀`,
      );
      setXboxGames(xboxCache.current[cacheKey]);
      setLoadingXbox(false);
      return;
    }

    setLoadingXbox(true);

    try {
      const params = new URLSearchParams({
        key: apiKey,
        parent_platforms: "3", // ID de Xbox en RAWG
      });

      if (textoBuscar.trim()) {
        params.append("search", textoBuscar);
      }

      // Si hay un año seleccionado, agregamos el parámetro de fechas (dates) compatible con RAWG
      if (anioFiltro) {
        const startDate = `${anioFiltro}-01-01`;
        const endDate = `${anioFiltro}-12-31`;
        params.append("dates", `${startDate},${endDate}`);
      }

      const response = await fetch(`${urlBase}?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error al obtener los videojuegos de Xbox");
      }

      const data = await response.json();
      const resultados = data.results || [];

      xboxCache.current[cacheKey] = resultados;
      setXboxGames(resultados);
    } catch (error) {
      console.error("Error al traer los juegos de Xbox:", error);
      xboxCache.current[cacheKey] = [];
      setXboxGames([]);
    } finally {
      setLoadingXbox(false);
    }
  };

  // Funciones para manejar la barra de navegación de años
  const filtrarPorAnio = (anio: string) => {
    setSelectedYear(anio);
    if (search.trim() !== "") {
      setLoadingXbox(true);
    }
    fetchXboxGames(search, anio);
  };

  const limpiarFiltroAnio = () => {
    setSelectedYear("");
    fetchXboxGames(search, "");
  };

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (search.trim() !== "") {
      setLoadingXbox(true);
    }

    searchTimerRef.current = window.setTimeout(() => {
      fetchXboxGames(search, selectedYear);
    }, 500);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [search]);

  return {
    xboxGames,
    loadingXbox,
    fetchXboxGames,
    selectedYear,
    filtrarPorAnio,
    limpiarFiltroAnio,
  };
}
