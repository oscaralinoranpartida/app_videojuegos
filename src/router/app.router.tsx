import { createHashRouter } from "react-router-dom";
import { lazy } from "react";

const Principal = lazy(() => import("../Principal"));
const PlayStation = lazy(() => import("../PlayStation"));
const Xbox = lazy(() => import("../Xbox"));
const Nintendo = lazy(() => import("../Nintendo"));
const Favoritos = lazy(() => import("../FavoritosFiltro"));

export const router = createHashRouter([
  {
    path: "/",
    element: <Principal />,
  },
  {
    path: "/PlayStation",
    element: <PlayStation />,
  },
  {
    path: "/xbox",
    element: <Xbox />,
  },
  {
    path: "/nintendo",
    element: <Nintendo />,
  },
  {
    path: "/favoritos",
    element: <Favoritos />,
  },
]);
