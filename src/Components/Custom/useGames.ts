import { useEffect, useRef, useReducer } from "react";
import type { Game } from "../../interfaces/Game.interface";

const urlBase = import.meta.env.VITE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

type TrailerCache = Record<string, string>;
type SearchCache = Record<string, Game[]>;

interface FiltersState {
  platforms?: string;
  genres?: string;
  ordering?: string;
  year?: string;
}

interface GamesState {
  videogames: Game[];
  search: string;
  busqueda: Game[];
  trailer: string;
  filters: FiltersState;
  loading: boolean;
  loadingSearch: boolean;
  loadingTrailer: boolean;
}

type GamesAction =
  | { type: "FETCH_GAMES_START" }
  | { type: "FETCH_GAMES_SUCCESS"; payload: Game[] }
  | { type: "FETCH_GAMES_ERROR" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SEARCH_GAMES_START" }
  | { type: "SEARCH_GAMES_SUCCESS"; payload: Game[] }
  | { type: "SEARCH_GAMES_ERROR" }
  | { type: "FETCH_TRAILER_START" }
  | { type: "FETCH_TRAILER_SUCCESS"; payload: string }
  | { type: "FETCH_TRAILER_ERROR" }
  | { type: "SET_TRAILER"; payload: string }
  | { type: "SET_FILTERS"; payload: FiltersState };

const initialState: GamesState = {
  videogames: [],
  search: "",
  busqueda: [],
  trailer: "",
  filters: {},
  loading: false,
  loadingSearch: false,
  loadingTrailer: false,
};

function gamesReducer(state: GamesState, action: GamesAction): GamesState {
  switch (action.type) {
    case "FETCH_GAMES_START":
      return {
        ...state,
        loading: true,
      };

    case "FETCH_GAMES_SUCCESS":
      return {
        ...state,
        loading: false,
        videogames: action.payload,
      };

    case "FETCH_GAMES_ERROR":
      return {
        ...state,
        loading: false,
        videogames: [],
      };

    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };

    case "SEARCH_GAMES_START":
      return {
        ...state,
        loadingSearch: true,
      };

    case "SEARCH_GAMES_SUCCESS":
      return {
        ...state,
        loadingSearch: false,
        busqueda: action.payload,
      };

    case "SEARCH_GAMES_ERROR":
      return {
        ...state,
        loadingSearch: false,
        busqueda: [],
      };

    case "FETCH_TRAILER_START":
      return {
        ...state,
        loadingTrailer: true,
        trailer: "",
      };

    case "FETCH_TRAILER_SUCCESS":
      return {
        ...state,
        loadingTrailer: false,
        trailer: action.payload,
      };

    case "FETCH_TRAILER_ERROR":
      return {
        ...state,
        loadingTrailer: false,
        trailer: "",
      };

    case "SET_TRAILER":
      return {
        ...state,
        trailer: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      };

    default:
      return state;
  }
}

export function useGames() {
  const [state, dispatch] = useReducer(gamesReducer, initialState);

  const trailerCache = useRef<TrailerCache>({});
  const searchCache = useRef<SearchCache>({});

  const fetchGames = async (customFilters?: FiltersState) => {
    dispatch({
      type: "FETCH_GAMES_START",
    });

    try {
      const params = new URLSearchParams({
        key: apiKey,
      });

      const activeFilters = customFilters || state.filters;

      if (activeFilters.platforms) {
        params.append("platforms", activeFilters.platforms);
      }
      if (activeFilters.genres) {
        params.append("genres", activeFilters.genres);
      }
      if (activeFilters.ordering) {
        params.append("ordering", activeFilters.ordering);
      }
      // Traduce el año seleccionado a un rango de fechas compatible con RAWG (YYYY-01-01,YYYY-12-31)
      if (activeFilters.year) {
        const startDate = `${activeFilters.year}-01-01`;
        const endDate = `${activeFilters.year}-12-31`;
        params.append("dates", `${startDate},${endDate}`);
      }

      const response = await fetch(`${urlBase}?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error al obtener los videojuegos");
      }

      const data = await response.json();

      dispatch({
        type: "FETCH_GAMES_SUCCESS",
        payload: data.results || [],
      });
    } catch (error) {
      console.error("Error al traer los juegos:", error);

      dispatch({
        type: "FETCH_GAMES_ERROR",
      });
    }
  };

  const buscarJuego = async (textoBuscar: string) => {
    const queryLimpia = textoBuscar.trim().toLowerCase();

    if (!queryLimpia) {
      dispatch({
        type: "SEARCH_GAMES_SUCCESS",
        payload: [],
      });

      return;
    }

    if (searchCache.current[queryLimpia]) {
      dispatch({
        type: "SEARCH_GAMES_SUCCESS",
        payload: searchCache.current[queryLimpia],
      });

      return;
    }

    dispatch({
      type: "SEARCH_GAMES_START",
    });

    try {
      const response = await fetch(
        `${urlBase}?key=${apiKey}&search=${encodeURIComponent(textoBuscar)}`,
      );

      if (!response.ok) {
        throw new Error("Error al buscar el videojuego");
      }

      const data = await response.json();

      const resultados = data.results || [];

      searchCache.current[queryLimpia] = resultados;

      dispatch({
        type: "SEARCH_GAMES_SUCCESS",
        payload: resultados,
      });
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);

      dispatch({
        type: "SEARCH_GAMES_ERROR",
      });
    }
  };

  const fetchTrailer = async (id: number | string) => {
    const gameId = String(id);

    if (gameId in trailerCache.current) {
      console.log("Trailer obtenido desde el caché 🎬");

      const cachedUrl = trailerCache.current[gameId];

      dispatch({
        type: "SET_TRAILER",
        payload: cachedUrl,
      });

      return cachedUrl;
    }

    dispatch({
      type: "FETCH_TRAILER_START",
    });

    try {
      const response = await fetch(`${urlBase}/${gameId}/movies?key=${apiKey}`);

      if (!response.ok) {
        throw new Error("Error al obtener el trailer");
      }

      const data = await response.json();

      let videoUrl = "";

      if (data.results?.length > 0) {
        const video = data.results[0];

        videoUrl =
          video.data?.max || video.data?.["720"] || video.data?.["480"] || "";
      }

      trailerCache.current[gameId] = videoUrl;

      dispatch({
        type: "FETCH_TRAILER_SUCCESS",
        payload: videoUrl,
      });

      return videoUrl;
    } catch (error) {
      console.error("Error al obtener el trailer:", error);

      trailerCache.current[gameId] = "";

      dispatch({
        type: "FETCH_TRAILER_ERROR",
      });

      return "";
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (!state.search.trim()) {
      dispatch({
        type: "SEARCH_GAMES_SUCCESS",
        payload: [],
      });

      return;
    }

    const timer = setTimeout(() => {
      buscarJuego(state.search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [state.search]);

  const setSearch = (value: string) => {
    dispatch({
      type: "SET_SEARCH",
      payload: value,
    });
  };

  const ejecutarBusquedaInmediata = (textoBuscar: string) => {
    buscarJuego(textoBuscar);
  };

  const setTrailer = (value: string) => {
    dispatch({
      type: "SET_TRAILER",
      payload: value,
    });
  };

  const aplicarFiltro = (newFilters: Partial<FiltersState>) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    dispatch({
      type: "SET_FILTERS",
      payload: updatedFilters,
    });
    fetchGames(updatedFilters);
  };

  const limpiarFiltros = () => {
    dispatch({
      type: "SET_FILTERS",
      payload: {},
    });
    fetchGames({});
  };

  return {
    videogames: state.videogames,
    search: state.search,
    setSearch,
    busqueda: state.busqueda,
    buscarJuego,
    ejecutarBusquedaInmediata,
    trailer: state.trailer,
    setTrailer,
    loadingTrailer: state.loadingTrailer,
    fetchTrailer,
    loading: state.loading,
    loadingSearch: state.loadingSearch,
    fetchGames,
    filters: state.filters,
    aplicarFiltro,
    limpiarFiltros,
  };
}
