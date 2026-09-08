import { useState, useEffect } from "react";
import Header from "../src/Components/Header";
import { useGames } from "../src/Components/Custom/useGames";
import "./styles.css";

interface Game {
  id: number;
  name: string;
  background_image: string;
  ratings_count: number;
  released: string;
  genres?: { name: string }[];
  parent_platforms?: { platform: { id: number; name: string } }[];
}

const FavoritosFiltro = () => {
  const {
    search,
    setSearch,
    trailer,
    setTrailer,
    loadingTrailer,
    fetchTrailer,
    ejecutarBusquedaInmediata,
  } = useGames();

  const [favoritos, setFavoritos] = useState<Game[]>(() => {
    const guardados = localStorage.getItem("mis_favoritos_arcade");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [juegoSeleccionadoId, setJuegoSeleccionadoId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem("mis_favoritos_arcade", JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (game: Game) => {
    const nuevosFavoritos = favoritos.filter((fav) => fav.id !== game.id);
    setFavoritos(nuevosFavoritos);
  };

  const handleVerTrailer = async (id: number) => {
    setJuegoSeleccionadoId(id);
    await fetchTrailer(id);
  };

  const handleCerrarTrailer = () => {
    setTrailer("");
    setJuegoSeleccionadoId(null);
  };

  const juegosAMostrar =
    search.trim() !== ""
      ? favoritos.filter((game) =>
          game.name.toLowerCase().includes(search.toLowerCase()),
        )
      : favoritos;

  return (
    <div className="pagina-principal">
      <Header onSearch={setSearch} onSearchEnter={ejecutarBusquedaInmediata} />

      <main className="contenedor-games">
        {juegosAMostrar.length > 0 ? (
          juegosAMostrar.map((game) => (
            <article key={game.id} className="tarjeta-games">
              <div className="contenedor-portada">
                <img
                  src={game.background_image}
                  alt={`Portada de ${game.name}`}
                  loading="lazy"
                />

                <button
                  className="boton-favorito-tarjeta es-fav"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(game);
                  }}
                  title="Quitar de favoritos"
                >
                  ❤️
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
                  {game.parent_platforms && game.parent_platforms.length > 0 ? (
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
          ))
        ) : (
          <p className="no-resultados">
            {search.trim() !== ""
              ? `No se encontraron favoritos que coincidan con "${search}".`
              : "Aún no tienes juegos agregados a tus favoritos."}
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

export default FavoritosFiltro;
