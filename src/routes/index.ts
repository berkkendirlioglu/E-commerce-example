export * from "./About";
export * from "./Contact";
export * from "./ErrorPage/ErrorPage.tsx";
export * from "./ForgotPassword";
export * from "./Homepage";
export * from "./Login";
export * from "./MyAccount";
export * from "./Payment";
export * from "./ProductDetail";
export * from "./Products";
export * from "./Register";
export * from "./SSS";
export * from "./ErrorPage";

// Components

export * from "../components/Navbar";
export * from "../components/Footer";
export * from "../components/AccountButton";
export * from "../components/Comments";
export * from "../components/CommentsGraphs";
export * from "../components/ContactForm";
export * from "../components/MostSellerCards";
export * from "../components/ProductCard";
export * from "../components/RatingStars";

// Dummy Datas
export { CardStore } from "../dummy-data/ProductsCardStore.ts";
export { commentsDummy } from "../dummy-data/commentsDummy.ts";
export { sssStore } from "../dummy-data/sssStore.ts";
export { shippingMethod } from "../dummy-data/shippingMethod.tsx";
export { Certificates } from "../dummy-data/certificates.ts";

// Images
export { default as Banner } from "../assets/images/banner.png";
export { default as SecBanner } from "../assets/images/secbanner.png";
export { default as Logo_Beyaz } from "../assets/images/LOGO_Beyaz.png";
export { default as Logo_Siyah } from "../assets/images/LOGO_Siyah.png";

// Types
export type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  UsersType,
  UpdateProfileType,
} from "../types/account-types.ts";
export type {
  CountriesType,
  RegionType,
  SubRegionType,
  CreateAddressResultType,
  AllAddressType,
  AddressPayloadType,
} from "../types/address-types.ts";
export type {
  AllProductType,
  ProductInfo,
  LoaderData,
} from "../types/all-product-types.ts";

export type { CertificatesType } from "../types/certificates-types.ts";
export type { CommentsType, DummyCommentsType } from "../types/comments-types.ts";
export type { FooterMenuType } from "../types/footer-menu-types.ts";
export type {
  MostSellerType,
  MostSellerData,
  LoaderMostSeller,
} from "../types/most-seller-types.ts";
export type { CategoriesType } from "../types/navbar-types.ts";
export type { AllOrderTypes, OrderDetailsType } from "../types/order-types.ts";
export type {
  PaymentMethodPayload,
  OrderToProductsPayload,
} from "../types/payment-types.ts";
export type {
  ProductDetailType,
  VariantsType,
  SizeType,
  BasketProductsPayload,
  BasketProductType,
} from "../types/product-detail-types.ts";
export type { ProductsCardsType } from "../types/products-cards-types.ts";
export type { sssStoreType } from "../types/sss-types.ts";
