import styles from "./mostsellercards.module.scss";
import {RatingStars, MostSellerType } from '../../routes/index.ts';
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const MostSellerCards = () => {
  const [mostSeller, setMostSeller] = useState<MostSellerType>();
  const BASE_URL: string = "https://fe1111.projects.academy.onlyjs.com";

  useEffect(() => {
      axios.get<MostSellerType>(`${BASE_URL}/api/v1/products/best-sellers`).then((response) => {
        setMostSeller(response.data);
      })
  }, []);

  const turkishToEnglish = (text: string) => {
    return text
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "S")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "U")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "G")
      .replace(/[^a-zA-Z0-9-]/g, "");
  };
  
  return (
    <>
      <section className={`${styles["most-seller-container"]}`}>
        <div className={`${styles["ms-content"]}`}>
          
          <div className={`${styles["ms-head"]}`}>
            <h3 className={`${styles["ms-text"]}`}>çok satanlar</h3>
          </div>

          <div className={`${styles["ms-cards"]}`}>
            {mostSeller?.data.map((mostSeller, index) => (
              <NavLink to={`/all-products/${encodeURIComponent(turkishToEnglish(
                mostSeller.name
                  .toLowerCase()
                  .replace("pre-workout", "preworkout")
                  .includes("preworkout supreme")
                  ? mostSeller.name
                      .toLowerCase()
                      .replace(" supreme", "")
                      .replace("pre-workout", "preworkout")
                      .replace(/\s+/g, "-")
                  : mostSeller.name
                      .toLowerCase()
                      .replace("pre-workout", "preworkout")
                      .replace(/\s+/g, "-")))}`} 
                    key={index} className={`${styles["most-seller-card"]}`}>
                <img
                  className={`${styles["most-seller-img"]}`}
                  src={BASE_URL + mostSeller.photo_src}
                  alt="products"
                />
                <h6 className={`${styles["most-seller-name"]}`}>
                  {mostSeller.name}
                </h6>
                <span className={`${styles["most-seller-desc"]}`}>
                  {mostSeller.short_explanation}
                </span>
                <RatingStars rating={5}/>
                {mostSeller.price_info.discount_percentage ? (
                  <div className={`${styles["comments-price"]}`}>
                    <div className={`${styles["most-seller-comments"]}`}>{mostSeller.comment_count} <span className={`${styles["count-text"]}`}>Yorum</span></div>
                    <div className={`${styles["discount-undiscount-price"]}`}>
                      <span className={`${styles["discount-price"]}`}>{Math.floor(mostSeller.price_info.discounted_price!)} TL </span>
                      <span className={`${styles["undiscount-price"]}`}>{mostSeller.price_info.total_price} TL </span>
                    </div>
                  </div>
                ):(
                  <div className={`${styles["comments-price"]}`}>
                    <div className={`${styles["most-seller-comments"]}`}>{mostSeller.comment_count} <span>Yorum</span></div>
                    <div className={`${styles["most-seller-price"]}`}>{mostSeller.price_info.total_price} <span>TL</span></div>
                  </div>
                )}
                {mostSeller.price_info.discount_percentage && (
                  <div className={`${styles["discount-wrapper"]}`}>
                    <span className={`${styles["discount-percentage"]}`}>%{mostSeller.price_info.discount_percentage} <span className={`${styles["percentage-text"]}`}>İNDİRİM</span></span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
};

