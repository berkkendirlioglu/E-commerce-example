import React, { useEffect } from "react";
import styles from "./navbar.module.scss";
import axios from "axios";
import { Logo_Siyah, navBarStore } from "../../../pages/index.ts";
import { NavLink } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

const BASE_URL: string = "https://fe1111.projects.academy.onlyjs.com";

const Navbar = () => {
  const {
    categories,
    handleMenu,
    handleBasket,
    handleAccount,
    handlePopupMenu,
    basket,
    search,
    searchResults,
    setCategories,
    sethandleMenu,
    sethandleBasket,
    sethandleAccount,
    sethandlePopupMenu,
    setBasket,
    setSearch,
    setSearchResults,
  } = navBarStore(
    useShallow((state) => ({
      categories: state.categories,
      handleMenu: state.handleMenu,
      handleBasket: state.handleBasket,
      handleAccount: state.handleAccount,
      handlePopupMenu: state.handlePopupMenu,
      basket: state.basket,
      search: state.search,
      searchResults: state.searchResults,
      setCategories: state.setCategories,
      sethandleMenu: state.sethandleMenu,
      sethandleBasket: state.sethandleBasket,
      sethandleAccount: state.sethandleAccount,
      sethandlePopupMenu: state.sethandlePopupMenu,
      setBasket: state.setBasket,
      setSearch: state.setSearch,
      setSearchResults: state.setSearchResults,
    }))
  );

  useEffect(() => {
    axios.get(`${BASE_URL}/api/v1/categories`).then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    if (search?.trim() === "") {
      setSearchResults([]);
      return;
    }
    axios
      .get(`${BASE_URL}/api/v1/products?search=${search}`)
      .then((response) => {
        setSearchResults(response.data.data);
      })
      .catch((error) => {
        console.error("error fetching products: ", error);
      });
  }, [search]);

  const handleLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number
  ) => {
    if (handleMenu) {
      event.preventDefault();
    }
    sethandlePopupMenu(index);
  };

  const session_id = localStorage.getItem("session_id");

  const handleLogOut = () => {
    localStorage.removeItem("session_id");
    window.location.href = "/";
  };

  useEffect(() => {
    setBasket(JSON.parse(localStorage.getItem("basket") || "[]"));
  }, []);

  const increaseProductCount = (productId: string) => {
    const updatedBasket = basket.map((item) =>
      item.id === productId ? { ...item, count: item.count! + 1 } : item
    );

    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const decreaseProductCount = (productId: string) => {
    const updatedBasket = basket.map((item) =>
      item.id === productId && item.count! > 1
        ? { ...item, count: item.count! - 1 }
        : item
    );

    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const basketTotalPrice = basket.reduce((accumulator, item) => {
    return accumulator + item.count! * item.price.total_price;
  }, 0);

  const removeBasketToProduct = (variantId: string) => {
    const removedItem = basket.filter((remove) => remove.id !== variantId);
    setBasket(removedItem);
    localStorage.setItem("basket", JSON.stringify(removedItem));
  };

  if(searchResults?.length! > 0){
    document.body.style.overflow = "hidden";
  }else{
    document.body.style.overflow = "";
  }

  console.log("search results: ", searchResults);

  return (
    <nav className={`${styles["navbar"]}`}>
      <div className={`${styles["navbar-wrapper"]}`}>
        <div className={`${styles["wrapper-container"]}`}>
          <button
            onClick={sethandleMenu}
            className={`${styles["hamburger-button"]} ${
              handleMenu ? styles["active-hamburger"] : ""
            }`}
          >
            <span className={`${styles["icon-line"]}`}></span>
            <span className={`${styles["icon-line"]}`}></span>
            <span className={`${styles["icon-line"]}`}></span>
          </button>

          <NavLink to={"/"} className={`${styles["logo-wrapper"]}`}>
            <img src={Logo_Siyah} alt="Logo" />
          </NavLink>

          <div className={`${styles["search-account-basket"]}`}>
            <div className={`${styles["search-wrapper"]}`}>
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className={`${styles["search"]} ${searchResults?.length! > 0 ? styles["active-input"]: ""}`}
                placeholder="Aradığınız ürünü yazınız"
                id="Search"
                type="text"
              />
              <label className={`${styles["search-button"]} ${searchResults?.length! > 0 ? styles["active-input"]: ""}`} htmlFor="Search">
                ARA
              </label>

              {searchResults?.length! > 0 && (
                <div onClick={() => setSearch("")} className={`${styles["search-results-wrapper"]}`}>
                  <div className={`${styles["search-results"]}`}>
                    {searchResults?.map((result, index) => (

                      <NavLink to={`/all-products/${result.slug}`} key={`product-${index}`} className={`${styles["product-box"]}`}>

                        <div className={`${styles["product-content-wrapper"]}`}>
                          
                          <div className={`${styles["product-img-wrapper"]}`}>
                            <img src={BASE_URL+result.photo_src} alt={result.name} />
                          </div>

                          <div className={`${styles["product-name-overview"]}`}>
                            <strong>{result.name}</strong>
                            <span className={`${styles["product-overview"]}`}>{result.short_explanation}</span>
                          </div>
                        </div>

                        {result.price_info.discounted_price ? (
                          <div className={`${styles["product-price-wrapper"]}`}>
                            <span className={`${styles["discount-price"]}`}>{Math.floor(Number(result.price_info.discounted_price)).toLocaleString("tr-TR")}&nbsp;TL</span>
                            <span className={`${styles["total-price"]} ${result.price_info.discounted_price ? styles["undiscount"]:""}`}>{result.price_info.total_price}&nbsp;TL</span>
                          </div>
                        ):(
                          <div className={`${styles["product-price-wrapper"]}`}>
                            <span className={`${styles["total-price"]}`}>{result.price_info.total_price}&nbsp;TL</span>
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              onMouseEnter={sethandleAccount}
              onMouseLeave={sethandleAccount}
              className={`${styles["account-wrapper"]}`}
            >
              <NavLink
                to={`${session_id ? "/my-account" : "/"}`}
                className={`${styles["account-button"]}`}
              >
                <span className={`${styles["account-icon"]}`}>
                  <i className="bi bi-person"></i>
                </span>
                {session_id ? (
                  <span className={`${styles["account-text-icon"]}`}>
                    HESABIM
                  </span>
                ) : (
                  <span className={`${styles["account-text-icon"]}`}>
                    HESAP <i className="bi bi-caret-down-fill"></i>
                  </span>
                )}
              </NavLink>

              {handleAccount && (
                <div className={`${styles["account-hover-wrapper"]}`}>
                  <div className={`${styles["hover-wrapper-container"]}`}>
                    {!session_id ? (
                      <div>
                        <NavLink
                          className={`${styles["account-link"]}`}
                          to={"/account/login"}
                        >
                          Üye Girişi
                        </NavLink>
                        <NavLink
                          className={`${styles["account-link"]}`}
                          to={"/account/register"}
                        >
                          Üye Ol
                        </NavLink>
                      </div>
                    ) : (
                      <div>
                        <NavLink
                          className={`${styles["account-link"]}`}
                          to={"/account/register"}
                          onClick={handleLogOut}
                        >
                          Çıkış Yap
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={`${styles["basket-wrapper"]}`}>
              <button
                onClick={sethandleBasket}
                className={`${styles["basket-button"]}`}
              >
                <i className={`${styles["basket-icon"]} bi bi-cart3 `}>
                  <p className={`${styles["product-count"]}`}>
                    {basket.length}
                  </p>
                </i>

                <span className={`${styles["basket-text"]}`}>SEPET</span>
              </button>
            </div>

            <div
              onClick={sethandleBasket}
              className={`${styles["basket-close-overlay"]} ${
                handleBasket ? "d-block" : ""
              }`}
            ></div>

            <div
              className={`${styles["basket-container"]} ${
                handleBasket ? styles["active-basket-container"] : ""
              }`}
            >
              <div className={`${styles["basket-title-wrapper"]}`}>
                <h5 className={`${styles["basket-title-text"]}`}>SEPETİM</h5>
                <button
                  onClick={sethandleBasket}
                  className={`${styles["basket-close-button"]}`}
                >
                  <i className={`${styles["close-icon"]} bi bi-x`}></i>
                </button>
              </div>

              <div className={`${styles["products-wrapper"]}`}>
                {basket.length > 0 ? (
                  <>
                    {basket.map((product) => (
                      <div className={`${styles["product-box"]}`}>
                        <div className={`${styles["product-content"]}`}>
                          <div className={`${styles["product-img-wrapper"]}`}>
                            <img
                              className={`${styles["basket-product-img"]}`}
                              src={`${BASE_URL + product.photo_src}`}
                              alt=""
                            />
                          </div>
                          <div className={`${styles["product-info"]}`}>
                            <span className={`${styles["product-title"]}`}>
                              {product.name}
                            </span>
                            <span className={`${styles["product-aroma"]}`}>
                              {product.aroma}
                            </span>
                            <span className={`${styles["product-gram"]}`}>
                              {product.size.gram
                                ? `${
                                    product.size.gram >= 1000
                                      ? `${(product.size.gram / 1000).toFixed(
                                          1
                                        )}KG`
                                      : `${product.size.gram}G`
                                  }`
                                : `${product.size.pieces} Adet ${product.size.total_services} Servis`}
                            </span>
                          </div>
                        </div>

                        <div className={`${styles["product-count-price"]}`}>
                          <div className={`${styles["product-price"]}`}>
                            {product.price.total_price * product.count!}&nbsp;TL
                          </div>
                          <div className={`${styles["product-count"]}`}>
                            {product.count === 1 ? (
                              <button
                                onClick={() =>
                                  removeBasketToProduct(product.id)
                                }
                                className={`${styles["trash-button"]}`}
                              >
                                <i className="bi bi-trash2"></i>
                              </button>
                            ) : (
                              <button
                                onClick={() => decreaseProductCount(product.id)}
                                className={`${styles["minus-button"]}`}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                            )}
                            <span
                              className={`${styles["product-current-count"]}`}
                            >
                              {product.count}
                            </span>
                            <button
                              onClick={() => increaseProductCount(product.id)}
                              className={`${styles["plus-button"]}`}
                            >
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className={`${styles["empty-basket"]}`}>
                    <p className={`${styles["empty-basket-text"]}`}>
                      Sepete eklenmiş herhangi bir ürün yok!
                    </p>
                  </div>
                )}
              </div>

              <div className={`${styles["basket-total-price"]}`}>
                <span className={`${styles["total-price"]}`}>
                  TOPLAM {basketTotalPrice} TL
                </span>
              </div>

              <div className={`${styles["basket-button-wrapper"]}`}>
                <NavLink
                  to={basket.length > 0 ? "/payment" : "/"}
                  className={`${styles["basket-button"]}`}
                >
                  DEVAM ET&nbsp;
                  <i
                    className={`${styles["basket-icon"]} bi bi-caret-right-fill`}
                  ></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles["navbar-wrapper"]}`}>
        <div className={`${styles["wrapper-container"]}`}>
          <div
            className={`${styles["links-wrapper"]} ${
              handleMenu ? styles["active-navbar"] : ""
            }`}
          >
            {categories?.data.data.map((links, index) => (
              <React.Fragment key={links.name}>
                <NavLink
                  onClick={(e) => handleLink(e, index)}
                  className={`${styles["link"]}`}
                  onMouseLeave={() => sethandlePopupMenu(null)}
                  onMouseEnter={() =>
                    handleMenu ? "" : sethandlePopupMenu(index)
                  }
                  to={handleMenu ? "#" : `/&main_category=${links.id}`}
                  key={index}
                >
                  <span className={`${styles["link-text"]}`}>{links.name}</span>
                  <i
                    className={`${styles["link-icon"]} ${
                      handlePopupMenu === index
                        ? "bi bi-chevron-up"
                        : "bi bi-chevron-down"
                    }`}
                  ></i>
                </NavLink>

                {handlePopupMenu === index && (
                  <React.Fragment key={links.slug}>
                    <div
                      onMouseEnter={() => sethandlePopupMenu(index)}
                      className={`${styles["pop-up-wrapper"]} ${
                        handlePopupMenu === index
                          ? styles["active-pop-up-menu"]
                          : ""
                      }`}
                    >
                      <div
                        className={`${styles["pop-up-menu"]}`}
                        onMouseLeave={() =>
                          handleMenu ? "" : sethandlePopupMenu(null)
                        }
                      >
                        <div className={`${styles["top-seller-wrapper"]}`}>
                          {links.top_sellers.map((top_seller) => (
                            <NavLink
                              key={top_seller.name}
                              className={`${styles["top-seller-link"]}`}
                              to={`/all-products/${top_seller.slug}`}
                            >
                              <div className={`${styles["top-seller-img"]}`}>
                                <img
                                  className={`${styles["product-img"]}`}
                                  src={`${BASE_URL + top_seller.picture_src}`}
                                  alt=""
                                />
                              </div>

                              <div className={`${styles["top-seller-texts"]}`}>
                                <h6 className={`${styles["product-name"]}`}>
                                  {top_seller.name}
                                </h6>
                                <span className={`${styles["product-desc"]}`}>
                                  {top_seller.description}
                                </span>
                              </div>
                            </NavLink>
                          ))}
                        </div>

                        <div className={`${styles["children-links-wrapper"]}`}>
                          <div
                            className={`${styles["children-links-container"]}`}
                          >
                            <div className={`${styles["back-button-wrapper"]}`}>
                              <button
                                onClick={() => sethandlePopupMenu(null)}
                                className={`${styles["back-button"]}`}
                              >
                                <i className="bi bi-chevron-left"></i> GERİ
                              </button>
                            </div>

                            {links.children.map((childlinks) => (
                              <>
                                <NavLink
                                  key={childlinks.name}
                                  className={`${styles["child-title-link"]}`}
                                  to={`/&sub_category=${childlinks.id}`}
                                  // onClick={sethandleMenu}
                                >
                                  <h6
                                    className={`${styles["child-title-text"]}`}
                                  >
                                    {childlinks.name}
                                  </h6>
                                </NavLink>
                                {childlinks.sub_children.map((sub_children) => (
                                  <NavLink
                                    key={sub_children.name}
                                    className={`${styles["subchild-link"]}`}
                                    to={`/all-products/${sub_children.slug}`}
                                  >
                                    {sub_children.name}
                                  </NavLink>
                                ))}
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
            <NavLink className={`${styles["link"]}`} to={"/all-products"}>
              TÜM ÜRÜNLER
            </NavLink>

            <div className={`${styles["other-links-wrapper"]}`}>
              <NavLink className={`${styles["other-link"]}`} to={"/my-account"}>
                HESABIM
              </NavLink>
              <NavLink className={`${styles["other-link"]}`} to={"/"}>
                MÜŞTERİ YORUMLARI
              </NavLink>
              <NavLink className={`${styles["other-link"]}`} to={"/contact"}>
                İLETİŞİM
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles["navbar-wrapper"]}`}>
        <div className={`${styles["wrapper-container"]}`}>
          <div className={`${styles["bottom-text-wrapper"]}`}>
            <i className={`${styles["text-icon"]} bi bi-box-seam`}></i>
            <span className={`${styles["bottom-first-text"]}`}>
              AYNI GÜN KARGO
            </span>
            <span className={`${styles["bottom-hyphen"]}`}>-</span>
            <span className={`${styles["bottom-last-text"]}`}>
              16:00'DAN ÖNCEKİ SİPARİŞLERDE
            </span>
          </div>

          <div className={`${styles["bottom-text-wrapper"]}`}>
            <i className={`${styles["text-icon"]} bi bi-emoji-smile`}></i>
            <span className={`${styles["bottom-first-text"]}`}>
              ÜCRETSİZ KARGO
            </span>
            <span className={`${styles["bottom-hyphen"]}`}>-</span>
            <span className={`${styles["bottom-last-text"]}`}>
              100 TL ÜZERİ SİPARİŞLERDE
            </span>
          </div>

          <div className={`${styles["bottom-text-wrapper"]}`}>
            <i className={`${styles["text-icon"]} bi bi-shield-check`}></i>
            <span className={`${styles["bottom-first-text"]}`}>
              GÜVENLİ ALIŞVERİŞ
            </span>
            <span className={`${styles["bottom-hyphen"]}`}>-</span>
            <span className={`${styles["bottom-last-text"]}`}>
              1.000.000+ MUTLU MÜŞTERİ
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
