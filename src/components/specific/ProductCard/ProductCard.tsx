import { NavLink } from 'react-router-dom';
import {AllProductType, RatingStars} from '../../../pages/index.ts';
import styles from './productcard.module.scss';

const BASE_URL:string ="https://fe1111.projects.academy.onlyjs.com";

const ProductCard = ({products} : {products:AllProductType["data"]["results"]}) => {
  return (
    <div className={`${styles["all-product-wrapper"]}`}>
            {products.map((product, index) => (
              <NavLink className={`${styles["card-wrapper"]}`} key={index} to={`/all-products/${product.slug}`}>

                  <div className={`${styles["card-img"]}`}>
                    <img className={`${styles["images"]}`} src={`${BASE_URL + product.photo_src}`} alt="Product" />
                  </div>
                  <div className={`${styles["card-title"]}`}>
                    <h6 className={`${styles["title"]}`}>{product.name}</h6>
                  </div>
                  <div className={`${styles["card-desc"]}`}>
                    <span className={`${styles["desc"]}`}>{product.short_explanation}</span>
                  </div>
                  <div className={`${styles["rate"]}`}>
                    <RatingStars rating={5}/>
                  </div>
                  <div className={`${styles["comment-count"]}`}>
                    <span className={`${styles["count"]}`}>{product.comment_count} Yorum</span>
                  </div>
                  {product.price_info.discount_percentage ? (
                    <div className={`${styles["price-info"]}`}>
                        <span className={`${styles["discount-price"]}`}>{Math.floor(product.price_info.discounted_price!)} TL</span>
                        <span className={`${styles["undiscount-price"]}`}>{product.price_info.total_price} TL</span>
                    </div>
                  ):(
                    <div className={`${styles["price-info"]}`}>
                        <span className={`${styles["price"]}`}>{product.price_info.total_price} TL</span>
                    </div>
                  )}
                  {product.price_info.discount_percentage && (
                    <div className={`${styles["discount-wrapper"]}`}>
                        <span className={`${styles["discount-percentage"]}`}>%{product.price_info.discount_percentage} <span className={`${styles["percentage-text"]}`}>İNDİRİM</span></span>
                    </div>
                  )}

              </NavLink>
            ))}
      </div>
  )
}

export default ProductCard
