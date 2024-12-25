import styles from "./homepage.module.scss";
import {
  MostSellerCards,
  CardStore,
  commentsDummy,
  Banner,
  SecBanner,
  Logo_Beyaz,
  RatingStars,
} from "../index.ts";
import { NavLink } from "react-router-dom";
import { useBlazeSlider } from "../../hooks/BlazeSlider.tsx";
import "blaze-slider/dist/blaze.css";

export const Homepage = () => {
  const { sliderElRef, sliderRef } = useBlazeSlider({
    all: {
      slidesToShow: 4,
      slidesToScroll: 1,
    },
    "(max-width:1200px)": {
      slidesToShow: 3,
    },
    "(max-width:768px)": {
      slidesToShow: 2,
    },
    "(max-width:576px)": {
      slidesToShow: 1,
    },
  });

  return (
    <>
      <main className={`${styles["main-container"]}`}>
        {/* Header Start */}
        <header className={`${styles["header-container"]}`}>
          <div className={`${styles["banner-container"]}`}>
            <img className={`${styles["banner"]}`} src={Banner} alt="Banner" />
          </div>
        </header>
        {/* Header End */}

        {/* Product Cards Start */}
        <section className={`${styles["products-container"]}`}>
          <div className={`${styles["container"]} container`}>
            <div className={`${styles["products"]}`}>
              {CardStore.map((Cards, index) => (
                <div
                  key={index}
                  className={`${styles["card-container"]}`}
                  style={{ backgroundImage: `url(${Cards.img})` }}
                >
                  <div className={`${styles["content"]}`}>
                    <h2
                      className={`${styles["content-text"]} ${
                        index === 4 ? styles["special-text"] : ""
                      }`}
                    >
                      {Cards.head}
                    </h2>

                    <div className={`${styles["button-container"]}`}>
                      <NavLink to={Cards.link} className={`${styles["inspect-button"]}`}>
                        <span className={`${styles["inspect-text"]}`}>
                          İNCELE
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Product Cards End */}

        <MostSellerCards/>

        {/* Second Banner Start */}
        <section className={`${styles["sec-banner-container"]}`}>
          <div className={`${styles["banner-content"]}`}>
            <img
              className={`${styles["sec-banner"]}`}
              src={SecBanner}
              alt="SecBanner"
            />

            <div className={`${styles["logo-container"]}`}>
              <img
                className={`${styles["banner-logo"]}`}
                src={Logo_Beyaz}
                alt="Logo"
              />
            </div>
          </div>
        </section>
        {/* Second Banner End */}

        {/* Blaze-Slider Start */}
        <section className={`${styles["slider"]}`}>
          <div className={`${styles["slider-container"]}`}>
            <div className={`${styles["slider-header"]}`}>
              <div className={`${styles["slider-left"]}`}>
                <h5 className={`${styles["slider-head"]}`}>
                  GERÇEK MÜŞTERİ YORUMLARI
                </h5>
              </div>

              <div className={`${styles["slider-right"]}`}>
                <div className={`${styles["rate-comments"]}`}>
                  <div className={`${styles["rate-stars"]}`}>
                    <RatingStars rating={5} />
                  </div>

                  <div className={`${styles["comment-count"]}`}>
                    0 <span>Yorum</span>
                  </div>
                </div>

                <div className={`${styles["structure"]}`}>
                  <button
                    className={`${styles["blaze-prev"]}`}
                    onClick={() => sliderRef.current?.prev()}
                    aria-label="Go to previous slide"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    className={`${styles["blaze-next"]}`}
                    onClick={() => sliderRef.current?.next()}
                    aria-label="Go to next slide"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`${styles["b-slider"]} blaze-slider`}
              ref={sliderElRef}
            >
              <div className={`${styles["b-container"]} blaze-container`}>
                <div
                  className={`${styles["track-container"]} blaze-track-container`}
                >
                  <div className={`${styles["tracks"]} blaze-track`}>
                    {commentsDummy.map((comment, index) => (
                      <div key={index} className={`${styles["comments"]}`}>
                        <div className={`${styles["comments-content"]}`}>
                          <div className={`${styles["date-rates"]}`}>
                            <div className={`${styles["rates"]}`}>
                              <RatingStars rating={5} />
                            </div>
                            <div className={`${styles["date"]}`}>
                              {comment.date}
                            </div>
                          </div>
                          <h5 className={`${styles["comments-title"]}`}>
                            {comment.title}
                          </h5>
                          <div className={`${styles["comments-desc"]}`}>
                            {comment.desc}
                          </div>
                          <div className={`${styles["comments-owner"]}`}>
                            {comment.owner}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Blaze-Slider End */}

        <section className={`${styles["last-section"]}`}>
          <div className={`${styles["last-section-container"]}`}>
            <div className={`${styles["last-section-header"]}`}>
              <div className={`${styles["rates"]}`}>
                <RatingStars rating={5} />
              </div>

              <span className={`${styles["header-text"]}`}>(140.000+)</span>
            </div>

            <div className={`${styles["last-section-content"]}`}>
              <p className={`${styles["first-text"]}`}>
                LABORATUVAR TESTLİ ÜRÜNLER AYNI GÜN & ÜCRETSİZ KARGO MEMNUNİYET
                GARANTİSİ
              </p>
              <p className={`${styles["second-text"]}`}>
                200.000'den fazla ürün yorumumuza dayanarak, ürünlerimizi
                seveceğinize eminiz. Eğer herhangi bir sebeple memnun kalmazsan,
                bizimle iletişime geçtiğinde çözüme kavuşturacağız.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

