// Pages Components
export {default as Homepage} from './Homepage/Homepage.tsx'
export {default as About} from './About/About.tsx'
export {default as Contact} from './Contact/Contact.tsx';
export {default as SSS} from './SSS/SSS.tsx';
export {default as Login} from './Login/Login.tsx';
export {default as Register} from './Register/Register.tsx';
export {default as ForgotPassword} from './ForgotPassword/ForgotPassword.tsx';
export {default as Products} from './Products/Products.tsx';
export {default as ProductDetail} from './ProductDetail/ProductDetail.tsx';
export {default as MyAccount} from './MyAccount/MyAccount.tsx';
export {default as Payment} from './Payment/Payment.tsx';


// Root & Routes Components
export {default as Root} from './Root'
export {default as AppRoutes} from '../routes/AppRoutes.tsx';

// Common Components 
export {default as Navbar} from '../components/common/Navbar/Navbar.tsx'
export {default as Footer} from '../components/common/Footer/Footer.tsx'

// Specific Components
export {default as MostSellerCards} from '../components/specific/MostSellerCards/MostSellerCards.tsx';
export {default as RatingStars} from '../components/specific/RatingStars/RatingStars.tsx';
export {default as ProductCard} from '../components/specific/ProductCard/ProductCard.tsx';
export {default as ContactForm} from '../components/specific/ContactForm/ContactForm.tsx';
export {default as AccountButton} from '../components/specific/AccountButton/AccountButton.tsx';
export {default as Comments} from '../components/specific/Comments/Comments.tsx';


// Fetch Data
export {fetchAllProducts} from './Products/Products.tsx';
export { FetchProductDetail } from './ProductDetail/ProductDetail.tsx';

// Images
export {default as Banner} from '../assets/images/banner.png';
export {default as SecBanner} from '../assets/images/secbanner.png';
export {default as Logo_Beyaz} from '../assets/images/LOGO_Beyaz.png';
export {default as Logo_Siyah} from '../assets/images/LOGO_Siyah.png';
export {default as certificate1} from '../assets/images/c1.png';
export {default as certificate2} from '../assets/images/c2.png';
export {default as certificate3} from '../assets/images/c3.png';
export {default as certificate4} from '../assets/images/c4.png';
export {default as certificate5} from '../assets/images/c5.png';
export {default as certificate6} from '../assets/images/c6.png';
export {default as ProteinImage} from '../assets/images/protein.png'
export {default as VitaminlerImage} from '../assets/images/vitaminler.png'
export {default as SaglıkImage} from '../assets/images/saglık.png'
export {default as SporGidalariImage} from '../assets/images/spor-gıdaları.png'
export {default as GidaImage} from '../assets/images/gıda.png'
export {default as AllProductsImage} from '../assets/images/allproducts.png'

// Types
export type { MostSellerType, LoaderMostSeller} from '../types/MostSellerType.ts';
export type {default as CommentsType} from '../types/CommentsType.ts';
export type {default as FooterMenuType} from '../types/footerMenuType.ts';
export type {default as sssStoreType} from '../types/sssStoreType.ts';
export type {default as CertificatesType} from '../types/certificatesType.ts';
export type {AllProductType, LoaderData, ProductInfo} from '../types/allproductType.ts';
export type {default as ProductDetailType, SizeType,VariantsType} from '../types/ProductDetailType.ts';
export type {default as CategoriesType} from '../types/navbarTypes.ts';
export type { PaymentMethodPayload } from '../types/PaymentTypes.ts';

// Store
export {navBarStore} from '../store/NavbarStore.ts';

// Dummy Datas
export { CardStore } from '../dummyData/ProductsCardStore.ts';
export { default as commentsDummy } from '../dummyData/commentsDummy.ts';
export { default as FooterMenu } from '../dummyData/FooterLinks.ts';
export { default as sssStore } from '../dummyData/sssStore.ts';
export { default as Certificates } from '../dummyData/certificates.ts';


