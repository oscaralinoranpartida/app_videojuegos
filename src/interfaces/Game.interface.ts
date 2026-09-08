import type { Genre } from "./Genre.interface";
import type { PlatformItem } from "./PlatformItem.interface";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  ratings_count: number;
  released: string;
  genres?: Genre[];
  parent_platforms?: PlatformItem[];
}
