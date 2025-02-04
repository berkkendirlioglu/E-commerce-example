import styles from "./about.module.scss";
import { Certificates, RatingStars } from "../index.ts";

export const About = () => {
  return (
    <>
      <div className={`${styles["about"]}`}>
        <div className={`${styles["about-container"]}`}>
          <div className={`${styles["about-wrapper"]}`}>

            <div className={`${styles["first-wrapper"]}`}>

              <div className={`${styles["about-texts"]}`}>
                <h2 className={`${styles["fw-title"]}`}>
                  Sağlıklı ve Fit Yaşamayı Zevkli ve Kolay Hale Getirmek İçin
                  Varız
                </h2>
                <div>
                  <article>
                    2016 yılından beri sporcu gıdaları, takviye edici gıdalar ve
                    fonksiyonel gıdaları üreten bir firma olarak;
                    müşterilerimize en kaliteli, lezzetli, tüketilmesi kolay
                    ürünleri sunuyoruz.
                  </article>
                  <br />
                  <article>
                    Müşteri memnuniyeti ve sağlığı her zaman önceliğimiz
                    olmuştur. Ürünlerimizde, yüksek kalite standartlarına bağlı
                    olarak,  sporcuların ve sağlıklı yaşam tutkunlarının
                    ihtiyaçlarına yönelik besleyici çözümler sunuyoruz. Ürün
                    yelpazemizdeki protein tozları, aminoasitler, vitamin ve
                    mineral takviyeleri ile spor performansınızı desteklemek
                    için ideal besin değerlerini sunuyoruz.
                  </article>
                  <br />
                  <article>
                    Sizin için sadece en iyisinin yeterli olduğunu biliyoruz. Bu
                    nedenle, inovasyon, kalite, sağlık ve güvenlik ilkelerimizi
                    korurken, sürekli olarak ürünlerimizi geliştirmeye ve
                    yenilikçi beslenme çözümleri sunmaya devam ediyoruz.
                  </article>
                  <br />
                  <article>
                    Sporcu gıdaları konusunda lider bir marka olarak, sizin
                    sağlığınıza ve performansınıza değer veriyoruz. Siz de spor
                    performansınızı en üst seviyeye çıkarmak ve sağlıklı yaşam
                    tarzınızı desteklemek
                  </article>
                  <br />
                  <article>
                    istiyorsanız, bize katılın ve en besleyici çözümlerimizle
                    tanışın. Sağlıklı ve aktif bir yaşam için biz her zaman
                    yanınızdayız.
                  </article>
                  <br />
                </div>
                
                <h2 className={`${styles["fw-title"]}`}>
                  1.000.000+ den Fazla Mutlu Müşteri
                </h2>
                <p>
                  Sanatçılardan profesyonel sporculara, doktordan öğrencilere
                  hayatın her alanında sağlıklı yaşamı ve beslenmeyi hedefleyen
                  1.000.000'den fazla kişiye ulaştık.
                </p>
              </div>

              <div className={`${styles["certificate"]}`}>
                <h2 className={`${styles["c-title"]}`}>Sertifikalarımız</h2> 
                <div className={`${styles["c-images"]}`}>
                  {Certificates.map((certificate, index) => (
                    <img key={index} src={certificate.src} alt="Certificates" />
                  ))}
                </div>
              </div>

            </div>

            <div className={`${styles["second-wrapper"]}`}>

              <div className={`${styles["sw-content"]}`}>

                <div className={`${styles["rate-comments"]}`}>
                  <RatingStars rating={5}/>
                  <span className={`${styles["comment-count"]}`}>0 Yorum</span>
                </div>

                <div className={`${styles["product-inspect"]}`}>
                  <div className={`${styles["inspect-btn"]}`}>ÜRÜN İNCELEMELERİ</div>
                </div>

                {/* <div className={`${styles["comments"]}`}>

                  <Comments/>

                </div> */}

              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

