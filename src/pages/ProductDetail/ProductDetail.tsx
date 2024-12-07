import styles from "./productdetail.module.scss";
import {
  ProductDetailType,
  RatingStars,
  VariantsType,
  MostSellerCards,
  SizeType,
  Comments,
  navBarStore,
} from "../index.ts";
import { useLoaderData, LoaderFunction, Params } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import CommentsGraphs from "../../components/specific/CommentsGraphs/CommentGraphs.tsx";
import { useShallow } from "zustand/react/shallow";

const Accordion = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  const toggleAccordion = () => {
    setisOpen(!isOpen);
  };

  return (
    <>
      <div className={`${styles["accordion-wrapper"]}`}>
        <button
          onClick={toggleAccordion}
          className={`${styles["accordion-title"]}`}
        >
          {title}{" "}
          <i className={isOpen ? "bi bi-chevron-up" : "bi bi-chevron-down"}></i>
        </button>
        {isOpen && (
          <div
            className={`${styles["accordion-content"]} ${
              isOpen ? "active" : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};

interface LoaderParams extends Params {
  product: string;
}

const BASE_URL = "https://fe1111.projects.academy.onlyjs.com";

export const FetchProductDetail: LoaderFunction = async ({ params }) => {
  const { products } = params as LoaderParams;

  if (!products) {
    throw new Response("", {
      status: 400,
      statusText: "Product ID is missing",
    });
  }

  const response = await fetch(`${BASE_URL}/api/v1/products/${products}`);

  if (!response.ok) {
    throw new Response("", {
      status: response.status,
      statusText: "veri bulunamadı",
    });
  }

  const data: ProductDetailType = await response.json();

  const dataStatus = data.status === "success";

  if (!dataStatus) {
    throw new Response("", {
      status: response.status,
      statusText: response.statusText,
    });
  }
  return {
    ProductDetail: data,
  };
};

interface AromaColors {
  [key: string]: string;
}
const getBackgroundColor = (aroma: string) => {
  const Aromas: AromaColors = {
    Bisküvi: "rgba(230, 188, 121, 1)",
    Çikolata: "rgba(86, 50, 29, 1)",
    Muz: "rgba(241, 208, 24, 1)",
    "Salted Caramel": "rgba(182, 67, 0, 1)",
    "Choco Nut": "rgba(123, 63, 0, 1)",
    "Hindistan Cevizi": "rgba(186, 144, 81, 1)",
    "Raspberry Cheesecake": "rgba(204, 30, 95, 1)",
    Çilek: "rgba(214, 31, 51, 1)",
    Karpuz: "rgba(188, 40, 40, 1)",
    Limonata: "rgba(227, 206, 141, 1)",
    "Fruit Fusion":
      "linear-gradient(25deg,hsl(39deg 100% 50%) 0%,hsl(34deg 100% 50%) 6%,hsl(29deg 100% 50%) 11%,hsl(24deg 100% 50%) 17%,hsl(19deg 100% 50%) 22%,hsl(20deg 100% 50%) 28%,hsl(28deg 100% 50%) 33%,hsl(35deg 100% 50%) 39%,hsl(43deg 100% 50%) 44%,hsl(51deg 100% 50%) 50%,hsl(33deg 100% 55%) 56%,hsl(15deg 100% 59%) 61%,hsl(357deg 100% 64%) 67%,hsl(339deg 100% 68%) 72%,hsl(327deg 100% 65%) 78%,hsl(320deg 100% 55%) 83%,hsl(313deg 100% 45%) 89%,hsl(307deg 100% 35%) 94%,hsl(300deg 100% 25%) 100%)",
    "Berry Blast":
      "linear-gradient(to top, #a92f3e, #9d2555, #872769, #673078, #3a377e)",
    Ahududu: "rgba(181, 123, 118, 1)",
    "Yeşil Elma": "rgba(151, 211, 14, 1)",
    Şeftali: "rgba(109, 36, 29, 1)",
    "Tigers Blood": "rgba(172, 33, 34, 1)",
  };

  return Aromas[aroma] || "rgb(78, 78, 78, 1)";
};

const ProductDetail = () => {
  const { ProductDetail } = useLoaderData() as {
    ProductDetail: ProductDetailType;
  };
  const [selectedVariant, setSelectedVariant] = useState<VariantsType[]>([
    ProductDetail.data.variants[0],
  ]);
  const [selectedAroma, setSelectedAroma] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<SizeType>();
  const [productCount, setProductCount] = useState<number>(1);
  const [addedBasket, setAddedBasket] = useState<boolean>(false);
  const { setBasket } = navBarStore(
    useShallow((state) => ({
      setBasket: state.setBasket,
    }))
  );

  const uniqueAromas = ProductDetail.data.variants.filter(
    (aromas, index, self) =>
      index === self.findIndex((v) => v.aroma === aromas.aroma)
  );

  const uniqueSizes = ProductDetail.data.variants.filter(
    (variant) => selectedAroma === variant.aroma
  );

  useEffect(() => {
    setSelectedAroma(uniqueAromas[0].aroma);
    setSelectedVariant([ProductDetail.data.variants[0]]);
    setSelectedSize(selectedVariant[0].size);
  }, [ProductDetail]);

  useEffect(() => {
    const filteredVariant = ProductDetail.data.variants.filter((variant) => {
      return (
        selectedAroma === variant.aroma &&
        selectedSize?.gram === variant.size.gram &&
        selectedSize.pieces === variant.size.pieces
      );
    });

    setSelectedVariant(filteredVariant);
  }, [selectedAroma, selectedSize]);

  useEffect(() => {
    if (uniqueSizes.length > 0) {
      const isSelectedSizeAvailable = uniqueSizes.some(
        (v) =>
          v.size.gram === selectedSize?.gram &&
          v.size.pieces === selectedSize.pieces
      );

      if (!isSelectedSizeAvailable) {
        setSelectedSize(uniqueSizes[0].size);
      }
    }
  }, [selectedAroma, selectedSize]);

  if (!selectedAroma || !selectedSize) {
    return <div>Yükleniyor...</div>;
  }

  const AddBasketProduct = () => {
    setAddedBasket(true);
    const storedBasket = localStorage.getItem("basket");
    const basketArray = storedBasket ? JSON.parse(storedBasket) : [];

    const productName = ProductDetail.data.name;
    const productCountVar = productCount;

    const updatedVariants = selectedVariant.map((variant) => ({
      ...variant,
      name: productName,
      count: productCountVar,
    }));

    const updatedBasketArray = [...basketArray];

    updatedVariants.forEach((newItem) => {
      const existingItemIndex = updatedBasketArray.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        updatedBasketArray[existingItemIndex].count += newItem.count;
      } else {
        updatedBasketArray.push(newItem);
      }
    });

    localStorage.setItem("basket", JSON.stringify(updatedBasketArray));
    setBasket(updatedBasketArray);

    setTimeout(() => {
      setAddedBasket(false);
    }, 2000);
  };

  return (
    <div className={`${styles["product-detail"]}`}>
      <div className={`${styles["product-detail-container"]}`}>
        <div className={`${styles["detail-wrapper"]}`}>
          <div className={`${styles["details-img"]}`}>
            {selectedVariant.map((filtered) => (
              <div key={filtered.id} className={`${styles["img-container"]}`}>
                <img
                  className={`${styles["img"]}`}
                  src={`${BASE_URL + filtered.photo_src}`}
                  alt="Product"
                />
              </div>
            ))}
          </div>

          <div className={`${styles["details"]}`}>
            <div className={`${styles["product-title"]}`}>
              <h2 className={`${styles["title"]}`}>
                {ProductDetail.data.name}
              </h2>
            </div>
            <div className={`${styles["product-short-exp"]}`}>
              <span className={`${styles["short-explanation"]}`}>
                {ProductDetail.data.short_explanation}
              </span>
            </div>
            <div className={`${styles["rate-comments"]}`}>
              <RatingStars rating={5} />
              <span className={`${styles["comment-count"]}`}>
                {ProductDetail.data.comment_count} Yorum
              </span>
            </div>
            <div className={`${styles["product-tags"]}`}>
              {ProductDetail.data.tags.map((tag, index) => (
                <div key={index} className={`${styles["tag"]}`}>
                  {tag}
                </div>
              ))}
              <hr />
            </div>
            <div className={`${styles["flavor-wrapper"]}`}>
              <div className={`${styles["flavor-title"]}`}>
                <span className={`${styles["f-title"]}`}>AROMA:</span>
              </div>

              <div className={`${styles["flavors"]}`}>
                {uniqueAromas.map((aromas) => (
                  <button
                    onClick={() => setSelectedAroma(aromas.aroma)}
                    key={aromas.aroma}
                    className={`${styles["flavor-btn"]} ${
                      selectedAroma === aromas.aroma ? styles["active"] : ""
                    }`}
                  >
                    <span className={`${styles["flavor"]}`}>
                      {aromas.aroma}
                    </span>
                    <span
                      style={{ background: getBackgroundColor(aromas.aroma) }}
                      className={`${styles["flavor-color"]}`}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`${styles["sizes-wrapper"]}`}>
              <div className={`${styles["sizes-title"]}`}>
                <span className={`${styles["s-title"]}`}>BOYUT:</span>
              </div>

              <div className={`${styles["sizes"]}`}>
                {uniqueSizes.map((portion) => (
                  <button
                    onClick={() => setSelectedSize(portion.size)}
                    key={portion.id}
                    className={`${styles["size-btn"]} ${
                      selectedSize?.gram === portion.size.gram &&
                      selectedSize.pieces === portion.size.pieces
                        ? styles["active"]
                        : ""
                    }`}
                  >
                    {portion.size.gram ? (
                      <>
                        <span className={`${styles["gram"]}`}>
                          {portion.size.gram >= 1000
                            ? `${(portion.size.gram / 1000).toFixed(1)}KG`
                            : `${portion.size.gram}G`}
                        </span>
                        <span className={`${styles["pieces"]}`}>
                          {portion.size.total_services}{" "}
                          <span className={`${styles["p-service"]}`}>
                            Servis
                          </span>
                        </span>
                        {portion.price.discount_percentage && (
                          <span
                            className={`${styles["discount-percentage-container"]}`}
                          >
                            <span
                              className={`${styles["discount-percentage"]}`}
                            >
                              %{portion.price.discount_percentage}{" "}
                              <span className={`${styles["discount-text"]}`}>
                                İNDİRİM
                              </span>
                            </span>
                          </span>
                        )}
                      </>
                    ) : (
                      //buraya discount-percentage eklemen gerekiyor
                      <div className={`${styles["not-gram-wrapper"]}`}>
                        <span className={`${styles[""]}`}>
                          {portion.size.pieces} Adet
                        </span>
                        <span className={`${styles[""]}`}>
                          {portion.size.total_services} Servis
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className={`${styles["product-price-info"]}`}>
              {selectedVariant.map((priceInfo) => (
                <div
                  key={priceInfo.id}
                  className={`${styles["price-service-content"]}`}
                >
                  {priceInfo.price.discounted_price ? (
                    <div className={`${styles["prices"]}`}>
                      <span className={`${styles["total-price"]}`}>
                        {Math.floor(priceInfo.price.total_price * productCount)}{" "}
                        TL
                      </span>
                      <span className={`${styles["discount-price"]}`}>
                        {Math.floor(
                          priceInfo.price.discounted_price * productCount
                        )}{" "}
                        TL
                      </span>
                    </div>
                  ) : (
                    <span className={`${styles["total-price"]}`}>
                      {Math.floor(priceInfo.price.total_price * productCount)}{" "}
                      TL
                    </span>
                  )}
                  <div className={`${styles["per-service-info"]}`}>
                    {priceInfo.price.price_per_servings} TL <span>/Servis</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles["product-count-cart-button"]}`}>
              <div className={`${styles["count-cart-container"]}`}>
                <div className={`${styles["product-count"]}`}>
                  <button
                    className={`${styles["minus-button"]}`}
                    onClick={() =>
                      setProductCount(
                        productCount > 1 ? productCount - 1 : productCount
                      )
                    }
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className={`${styles["count"]}`}>{productCount}</span>
                  <button
                    className={`${styles["plus-button"]}`}
                    onClick={() => setProductCount(productCount + 1)}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>

                <div className={`${styles["cart-button-wrapper"]}`}>
                    {addedBasket ? (
                      <>
                      <div className={`${styles["check-icon"]}`}>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/c/c6/Sign-check-icon.png"
                          alt=""
                        />
                      </div>
                      <span>Ürün Sepete Eklendi!</span>
                      </>
                    ):(
                      <>
                      <button
                      onClick={AddBasketProduct}
                      className={`${styles["cart-button"]}`}
                    >
                      <i className="bi bi-cart"></i>
                      <span className={`${styles["button-text"]}`}>
                        SEPETE EKLE
                      </span>
                    </button>
                      </>
                    )}
                    
                </div>

              </div>
            </div>
            <div className={`${styles["product-description-wrapper"]}`}>
              <p
                dangerouslySetInnerHTML={{
                  __html: ProductDetail.data.explanation.description.replace(
                    /\n/g,
                    "<br/>"
                  ),
                }}
              />
            </div>
            <div className={`${styles["product-ingredients-accordion"]}`}>
              <Accordion title="ÖZELLİKLER">
                <p
                  dangerouslySetInnerHTML={{
                    __html: ProductDetail.data.explanation.features.replace(
                      /\n/g,
                      "<br/>"
                    ),
                  }}
                />
              </Accordion>

              <Accordion title="BESİN İÇERİĞİ">
                <div className={`${styles["facts-table"]}`}>
                  <div className={`${styles["facts-header"]}`}>
                    <span className={`${styles["facts-title"]}`}>
                      BESİN DEĞERLERİ
                    </span>
                    <span className={`${styles["per-service"]}`}>
                      {
                        ProductDetail.data.explanation.nutritional_content
                          .nutrition_facts.portion_sizes
                      }
                    </span>
                  </div>
                  {ProductDetail.data.explanation.nutritional_content.nutrition_facts.ingredients.map(
                    (facts) => (
                      <div className={`${styles["facts-content"]}`}>
                        <span className={`${styles["facts-name"]}`}>
                          {facts.name}
                        </span>
                        <span className={`${styles["facts-value"]}`}>
                          {facts.amounts}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className={`${styles["ingredients-content"]}`}>
                  {ProductDetail.data.explanation.nutritional_content.ingredients.map(
                    (nutritionals, index) => (
                      <p
                        key={index}
                        className={`${styles["ingredients-aroma"]}`}
                      >
                        {nutritionals.aroma}:{" "}
                        <span className={`${styles["ingredients-value"]}`}>
                          {nutritionals.value}
                        </span>
                      </p>
                    )
                  )}
                </div>

                {ProductDetail.data.explanation.nutritional_content
                  .amino_acid_facts &&
                ProductDetail.data.explanation.nutritional_content
                  .amino_acid_facts.ingredients ? (
                  <div key={"facts"} className={`${styles["facts-table"]}`}>
                    <div className={`${styles["facts-header"]}`}>
                      <span className={`${styles["facts-title"]}`}>
                        AMİNO ASİT DEĞERLERİ
                      </span>
                      <span className={`${styles["per-service"]}`}>
                        {
                          ProductDetail.data.explanation.nutritional_content
                            .amino_acid_facts.portion_sizes
                        }
                      </span>
                    </div>
                    {ProductDetail.data.explanation.nutritional_content.amino_acid_facts.ingredients.map(
                      (facts, index) => (
                        <div
                          key={index}
                          className={`${styles["facts-content"]}`}
                        >
                          <span className={`${styles["facts-name"]}`}>
                            {facts.name}
                          </span>
                          <span className={`${styles["facts-value"]}`}>
                            {facts.amounts}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Accordion>

              <Accordion title="KULLANIM ŞEKLİ">
                <p
                  dangerouslySetInnerHTML={{
                    __html: ProductDetail.data.explanation.usage.replace(
                      /\n/g,
                      "<br/>"
                    ),
                  }}
                />
              </Accordion>
            </div>
          </div>

          <div className={`${styles["most-seller-wrapper"]}`}>
            <MostSellerCards />
          </div>

          <div className={`${styles["product-comments-wrapper"]}`}>
            <div className={`${styles["comments-header"]}`}>
              <div className={`${styles["avarage-comments"]}`}>
                <div className={`${styles["avarage-comments-content"]}`}>
                  <p className={`${styles["avarage"]}`}>
                    {ProductDetail.data.average_star}
                  </p>
                  <RatingStars rating={5} />
                  <p className={`${styles["comment-count"]}`}>
                    {ProductDetail.data.comment_count} YORUM
                  </p>
                </div>
              </div>

              <div className={`${styles["comments-graph"]}`}>
                <CommentsGraphs />
              </div>
            </div>

            <div className={`${styles["comments"]}`}>
              <div className={`${styles["total-comments"]}`}>
                <div className={`${styles["total-comments-count"]}`}>
                  Yorum ({ProductDetail.data.comment_count})
                </div>
              </div>

              <Comments />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
