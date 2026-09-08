import { RouterProvider } from "react-router-dom";
import { router } from "./router/app.router";
import { FavoriteHeroProvider } from "./context/FavoriteGameContext"; // <--- Ajusta la ruta si es necesario

const GamesApp = () => {
  return (
    <FavoriteHeroProvider>
      <RouterProvider router={router} />
    </FavoriteHeroProvider>
  );
};

export default GamesApp;
