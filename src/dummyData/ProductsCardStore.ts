import { ProductsCardsType } from "../types/ProductsCardsType";
import {
  ProteinImage,
  VitaminlerImage,
  SaglıkImage,
  SporGidalariImage,
  GidaImage,
  AllProductsImage,
} from "../pages/index.ts";

export const CardStore: ProductsCardsType[] = [
  {
    img: ProteinImage,
    head: "protein",
  },
  {
    img: VitaminlerImage,
    head: "vitaminler",
  },
  {
    img: SaglıkImage,
    head: "sağlık",
  },
  {
    img: SporGidalariImage,
    head: "spor gıdaları",
  },
  {
    img: GidaImage,
    head: "gıda",
  },
  {
    img: AllProductsImage,
    head: "tüm ürünler",
  },
];
