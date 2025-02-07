import { ProductsCardsType } from "../types/products-cards-types";
import ProteinImage from "../assets/images/protein.png";
import VitaminlerImage from "../assets/images/vitaminler.png";
import SaglıkImage from "../assets/images/saglık.png";
import SporGidalariImage from "../assets/images/spor-gıdaları.png";
import GidaImage from "../assets/images/gıda.png";
import AllProductsImage from "../assets/images/allproducts.png";

export const CardStore: ProductsCardsType[] = [
  {
    img: ProteinImage,
    head: "protein",
    link: "/&main_category=38fb5754-3068-4490-a12a-169fa564c675",
  },
  {
    img: VitaminlerImage,
    head: "vitaminler",
    link: "/&main_category=84229f35-1b8a-4e02-9688-245c39c8ec42",
  },
  {
    img: SaglıkImage,
    head: "sağlık",
    link: "/&main_category=cae64711-98b9-48f4-82b4-c5d460718dcf",
  },
  {
    img: SporGidalariImage,
    head: "spor gıdaları",
    link: "/&main_category=d3cdcefe-eedd-4ee0-a254-b821ed4e2b8c",
  },
  {
    img: GidaImage,
    head: "gıda",
    link: "/&main_category=8eaeff30-3138-49ac-b120-0eac18866190",
  },
  {
    img: AllProductsImage,
    head: "tüm ürünler",
    link: "/all-products",
  },
];
