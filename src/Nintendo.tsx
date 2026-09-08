import "./styles.css";
import Header from "./Components/Header";
import { useNintendoGames } from "./Components/Custom/useNintendoGames";
import { useState } from "react";
import { useFavorites } from "./context/FavoriteGameContext";

const urlBase = import.meta.env.VITE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const Nintendo = () => {
  const [search, setSearch] = useState("");

  const {
    nintendoGames,
    loadingNintendo,
    fetchNintendoGames,
    filtrarPorAnio,
    limpiarFiltroAnio,
  } = useNintendoGames({
    urlBase,
    apiKey,
    search,
  });

  const { isFavorite, toggleFavorite } = useFavorites();
  const [trailer, setTrailer] = useState("");
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [juegoSeleccionadoId, setJuegoSeleccionadoId] = useState<number | null>(
    null,
  );

  const fetchTrailer = async (id: number | string) => {
    setLoadingTrailer(true);
    try {
      const response = await fetch(`${urlBase}/${id}/movies?key=${apiKey}`);
      if (!response.ok) throw new Error("Error al obtener el trailer");
      const data = await response.json();

      let videoUrl = "";
      if (data.results?.length > 0) {
        const video = data.results[0];
        videoUrl = video.data?.max || "";
      }
      setTrailer(videoUrl);
      return videoUrl;
    } catch (error) {
      console.error("Error al obtener el trailer:", error);
      setTrailer("");
      return "";
    } finally {
      setLoadingTrailer(false);
    }
  };

  const estaBuscando = search.trim() !== "";

  const handleVerTrailer = async (id: number) => {
    setJuegoSeleccionadoId(id);
    await fetchTrailer(id);
  };

  const handleCerrarTrailer = () => {
    setTrailer("");
    setJuegoSeleccionadoId(null);
  };

  return (
    <div className="pagina-principal">
      <Header
        onSearch={(searchParams) => setSearch(searchParams)}
        onSearchEnter={(texto) => fetchNintendoGames(texto)}
      />

      <nav
        className="nav-filtros"
        style={{
          display: "flex",
          gap: "15px",
          padding: "10px 20px",
          background: "#1a1a1a",
          color: "#fff",
        }}
      >
        <button
          onClick={() => limpiarFiltroAnio()}
          style={{
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Todos (Inicio)
        </button>
        <button
          onClick={() => filtrarPorAnio("2025")}
          style={{
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "#aaa",
          }}
        >
          2025
        </button>
        <button
          onClick={() => filtrarPorAnio("2024")}
          style={{
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "#aaa",
          }}
        >
          2024
        </button>
        <button
          onClick={() => filtrarPorAnio("2023")}
          style={{
            cursor: "pointer",
            background: "transparent",
            border: "none",
            color: "#aaa",
          }}
        >
          2023
        </button>
      </nav>

      <main className="contenedor-games">
        {loadingNintendo ? (
          <p className="cargando">
            {estaBuscando
              ? "Buscando juegos de Nintendo..."
              : "Cargando videojuegos de Nintendo..."}
          </p>
        ) : nintendoGames.length > 0 ? (
          nintendoGames.map((game) => {
            const esFavorito = isFavorite(game);

            return (
              <article key={game.id} className="tarjeta-games">
                <div className="contenedor-portada">
                  <img
                    src={game.background_image}
                    alt={`Portada de ${game.name}`}
                    loading="lazy"
                  />

                  <button
                    className={`boton-favorito-tarjeta ${esFavorito ? "es-fav" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game);
                    }}
                    title={
                      esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"
                    }
                  >
                    {esFavorito ? "❤️" : "♡"}
                  </button>

                  <div
                    className="capa-reproduccion"
                    onClick={() => handleVerTrailer(game.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="boton-play-icono">
                      <svg
                        width="45"
                        height="45"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="icono-play"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="informacion-game">
                  <h2 className="titulo-game">{game.name}</h2>

                  <p>
                    <strong>Valoración:</strong>{" "}
                    {game.ratings_count || "No disponible"}
                  </p>

                  <p>
                    <strong>Fecha de lanzamiento:</strong>{" "}
                    {game.released || "No disponible"}
                  </p>

                  <p>
                    <strong>Género:</strong>{" "}
                    {game.genres?.[0]?.name || "No especificado"}
                  </p>
                </div>

                <div className="plataformas">
                  <h3>Plataformas</h3>

                  <div className="plataformas-lista">
                    {game.parent_platforms &&
                    game.parent_platforms.length > 0 ? (
                      game.parent_platforms.map(({ platform }) => (
                        <span key={platform.id} className="plataforma">
                          {platform.name}
                        </span>
                      ))
                    ) : (
                      <span>No especificado</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="no-resultados">
            {estaBuscando
              ? `No se encontraron juegos de Nintendo para "${search}".`
              : "No hay videojuegos de Nintendo disponibles para este filtro."}
          </p>
        )}
      </main>

      {juegoSeleccionadoId && (
        <div className="modal-trailer">
          <div className="contenido-modal">
            <button className="boton-cerrar" onClick={handleCerrarTrailer}>
              X
            </button>

            {loadingTrailer ? (
              <p className="cargando">Cargando trailer...</p>
            ) : trailer ? (
              <video controls autoPlay className="video-reproductor">
                <source src={trailer} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <p className="no-resultados">
                Este juego no tiene trailer disponible.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nintendo;
