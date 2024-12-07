import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Users from "../../dummyData/Users.json";
import { SubmitHandler, useForm } from "react-hook-form";
import { AccountSettingsType, DeliveryType } from "../index.ts";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { NavLink } from "react-router-dom";

function MyAccount() {
  const [activeSection, setactiveSection] = useState<
    "accountInfo" | "delivery" | "address"
  >("accountInfo");
  const [accountForm, setAccountForm] = useState<AccountSettingsType>();
  const [isAddress, setisAddress] = useState<boolean>();
  const [address, setAddress] = useState<AccountSettingsType[]>([]);
  const [Deliveries, setDeliveries] = useState<DeliveryType[] | undefined>(
    () => {
      const allDeliveries = localStorage.getItem("completeDelivery");
      return allDeliveries ? JSON.parse(allDeliveries) : undefined;
    }
  );
  const [deliveriesDetail, setdeliveriesDetail] = useState<DeliveryType[]>();
  const [DeliveryId, setDeliveryId] = useState<string>();
  const { register, handleSubmit } = useForm<AccountSettingsType>();

  useEffect(() => {
    setDeliveries(() => {
      const arrayDeliveries = localStorage.getItem("completeDelivery");
      return arrayDeliveries ? JSON.parse(arrayDeliveries) : []
    })
  }, []);

  const accountSubmit: SubmitHandler<AccountSettingsType> = (data) => {
    setAccountForm(data);
    localStorage.setItem("account", JSON.stringify(accountForm));
  };

  const addressSubmit: SubmitHandler<AccountSettingsType> = (data) => {
    const storedAddress = localStorage.getItem("address");
    const addressArray = storedAddress ? JSON.parse(storedAddress) : [];
    const updatedAddressArray = [...addressArray, data];

    localStorage.setItem("address", JSON.stringify(updatedAddressArray));

    setAddress(updatedAddressArray);
    setisAddress(updatedAddressArray.length > 0);
  };

  const handleDeleteAddress = (addressToDelete: string) => {
    const updatedAddressArray = address.filter(
      (address) => address.address !== addressToDelete
    );

    localStorage.setItem("address", JSON.stringify(updatedAddressArray));

    setAddress(updatedAddressArray);
    setisAddress(updatedAddressArray.length > 0);
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    const addressArray = storedAddress ? JSON.parse(storedAddress) : [];
    setAddress(addressArray);
    setisAddress(addressArray.length > 0);
  }, [
    window.addEventListener("storage", (event) => {
      event;
    }),
  ]);

  const userData = Users.results[0];

  useEffect(() => {
    const filteredDelivery = Deliveries?.filter((delivery) => {
      return delivery.deliveryNumber === DeliveryId;
    });
    setdeliveriesDetail(filteredDelivery);
  }, [DeliveryId]);

  const basketUndiscountPrice = deliveriesDetail?.[0]?.products?.reduce(
    (accumulator, item) => {
      const totalPrice = item.price?.total_price;
      const count = item.count ?? 1;
      return accumulator + count * totalPrice;
    },
    0
  );

  const basketTotalPrice = deliveriesDetail?.[0]?.products?.reduce(
    (accumulator, item) => {
      const discountedPrice = item.price?.discounted_price;
      const totalPrice = item.price?.total_price;
      const count = item.count ?? 1;
      return discountedPrice
        ? accumulator + count * discountedPrice
        : accumulator + count * (totalPrice ?? 0);
    },
    0
  );

  console.log(basketTotalPrice);

  return (
    <div className={`${styles["my-account-container"]}`}>
      <div className={`${styles["my-account-wrapper"]}`}>
        <div className={`${styles["menu-links"]}`}>
          <div className={`${styles["menu-title"]}`}>
            <h2 className={`${styles["title"]}`}>Hesabım</h2>
          </div>

          <div className={`${styles["my-account-links"]}`}>
            <ul className={`${styles["links"]}`}>
              <li
                onClick={() => setactiveSection("accountInfo")}
                className={`${styles["link"]} ${
                  activeSection === "accountInfo" ? styles["active-link"] : ""
                }`}
              >
                <i className="bi bi-sliders"></i>&nbsp;Hesap Bilgilerim
              </li>
              <li
                onClick={() => setactiveSection("delivery")}
                className={`${styles["link"]} ${
                  activeSection === "delivery" ? styles["active-link"] : ""
                }`}
              >
                <i className="bi bi-box2"></i>&nbsp;Siparişlerim
              </li>
              <li
                onClick={() => setactiveSection("address")}
                className={`${styles["link"]} ${
                  activeSection === "address" ? styles["active-link"] : ""
                }`}
              >
                <i className="bi bi-geo-alt"></i>&nbsp;Adreslerim
              </li>
            </ul>
          </div>
        </div>

        <div className={`${styles["content-container"]}`}>
          {activeSection === "accountInfo" && (
            <div className={`${styles["account-info-container"]}`}>
              <div className={`${styles["info-title-wrapper"]}`}>
                <h5 className={`${styles["info-title"]}`}>Hesap Bilgilerim</h5>
              </div>

              <form
                onSubmit={handleSubmit(accountSubmit)}
                className={`${styles["account-info-form"]}`}
                action="#"
              >
                <label className={`${styles["firstName"]}`} htmlFor="firstName">
                  *Ad
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  id={`${styles["firstName"]}`}
                />

                <label className={`${styles["lastName"]}`} htmlFor="lastName">
                  *Soyad
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  id={`${styles["lastName"]}`}
                />

                <label className={`${styles["phone"]}`} htmlFor="phone">
                  Telefon
                </label>
                <PhoneInput
                  {...register("phone")}
                  className={`${styles["phone-input"]}`}
                  defaultCountry="TR"
                  onChange={() => ""}
                />

                <label className={`${styles["email"]}`} htmlFor="email">
                  E-Posta
                </label>
                <input
                  type="email"
                  id={`${styles["email"]}`}
                  disabled
                  value={userData.email}
                />

                <div className={`${styles["info-button-wrapper"]}`}>
                  <button className={`${styles["info-button"]}`}>Kaydet</button>
                </div>
              </form>
            </div>
          )}
          {activeSection === "delivery" && (
            <>
              {Deliveries !== undefined ? (
                <>
                  {DeliveryId ? (
                    <>
                      {deliveriesDetail?.map((delivery, index) => (
                        <div
                          key={`delivery-detail-${index}`}
                          className={`${styles["delivery-detail-container"]}`}
                        >
                          <button
                            onClick={() => setDeliveryId("")}
                            className={`${styles["delivery-back-button"]}`}
                          >
                            <i className="bi bi-arrow-left"></i>&nbsp;Geri
                          </button>

                          <div className={`${styles["detail-title-wrapper"]}`}>
                            <span className={`${styles["delivery-status"]}`}>
                              Sipariş Teslim Edildi
                            </span>
                            <span>
                              {delivery.deliveryDate} Tarihinde Teslim Edildi -{" "}
                              <span>
                                {delivery.deliveryNumber} numaralı sipariş
                              </span>
                            </span>
                          </div>

                          <div
                            className={`${styles["delivery-detail-content"]}`}
                          >
                            <div
                              className={`${styles["product-detail-wrapper"]}`}
                            >
                              {delivery.products?.map((product, index) => (
                                <div
                                  key={`delivery-product-${index}`}
                                  className={`${styles["product-box"]}`}
                                >
                                  <div
                                    className={`${styles["product-img-wrapper"]}`}
                                  >
                                    <img
                                      src={
                                        import.meta.env.VITE_BASE_URL +
                                        product.photo_src
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div
                                    className={`${styles["product-name-detail"]}`}
                                  >
                                    <p className={`${styles["product-name"]}`}>
                                      {product.name} x {product.count}
                                    </p>
                                    <p className={`${styles["product-price"]}`}>
                                      {product.price.discounted_price
                                        ? product.price.discounted_price
                                        : product.price.total_price}
                                      &nbsp;TL
                                    </p>
                                    <p className={`${styles["product-size"]}`}>
                                      Boyut:{" "}
                                      {!product.size.gram
                                        ? `${product.size.pieces} Kutu`
                                        : `${product.size.gram}G`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              <div
                                className={`${styles["product-shipping-detail"]}`}
                              >
                                <p>
                                  <strong>
                                    {deliveriesDetail[0].shipping}
                                  </strong>{" "}
                                  Takip Numarası: DHF255465465458
                                </p>
                              </div>
                            </div>

                            <div
                              className={`${styles["delivery-information-wrapper"]}`}
                            >
                              <div
                                className={`${styles["delivery-address-wrapper"]}`}
                              >
                                <h5 className={`${styles["address-title"]}`}>
                                  Adres
                                </h5>
                                <span className={`${styles["user-fullName"]}`}>
                                  {deliveriesDetail[0].address!.firstName +
                                    " " +
                                    deliveriesDetail[0].address!.lastName}
                                </span>
                                <span className={`${styles["full-address"]}`}>
                                  {deliveriesDetail[0].address!.address}/{" "}
                                  {deliveriesDetail[0].address!.state}/{" "}
                                  {deliveriesDetail[0].address!.city}
                                </span>
                              </div>
                              <div
                                className={`${styles["credit-card-wrapper"]}`}
                              >
                                <span
                                  className={`${styles["credit-card-items"]}`}
                                >
                                  Kredi Kartı -{" "}
                                  {basketTotalPrice?.toLocaleString("tr-TR")}
                                  &nbsp;TL
                                </span>
                                <span
                                  className={`${styles["credit-card-items"]}`}
                                >
                                  {deliveriesDetail![0].payment?.cardNumber
                                    ?.replace(/.(?=.{2})/g, "*")
                                    .match(/.{1,4}/g)
                                    ?.join(" ")}
                                </span>
                              </div>
                              <div
                                className={`${styles["price-details-wrapper"]}`}
                              >
                                <h6
                                  className={`${styles["price-detail-title"]}`}
                                >
                                  Özet
                                </h6>
                                <div className={`${styles["price-details"]}`}>
                                  <span>Ara Toplam</span>
                                  <span>
                                    {basketUndiscountPrice?.toLocaleString(
                                      "tr-TR"
                                    )}{" "}
                                    TL
                                  </span>
                                </div>
                                <div className={`${styles["price-details"]}`}>
                                  <span>Kargo</span>
                                  <span>0 TL</span>
                                </div>
                                <div className={`${styles["price-details"]}`}>
                                  <span>Toplam Vergi</span>
                                  <span>
                                    {(basketTotalPrice! * 0.18).toFixed(2)} TL
                                  </span>
                                </div>
                                <div className={`${styles["price-details"]}`}>
                                  <span>
                                    Yüzde&nbsp;
                                    {[
                                      ...new Set(
                                        deliveriesDetail[0].products?.map(
                                          (product) =>
                                            product.price?.discount_percentage
                                        )
                                      ),
                                    ]
                                      .sort((a, b) => a! - b!)
                                      .join(", ") ?? "0"}{" "}
                                    indirim!
                                  </span>
                                  <span>
                                    {deliveriesDetail[0].products
                                      ?.reduce((accumulator, product) => {
                                        if (product.price.discounted_price) {
                                          return (
                                            accumulator +
                                            product.price.discounted_price * 0.1
                                          );
                                        }
                                        return accumulator;
                                      }, 0)
                                      .toLocaleString("tr-TR")}{" "}
                                    TL
                                  </span>
                                </div>
                                <div className={`${styles["price-details"]}`}>
                                  <span>Toplam</span>
                                  <span>
                                    {basketTotalPrice?.toLocaleString("tr-TR")}{" "}
                                    TL
                                  </span>
                                </div>
                              </div>
                              <div className={`${styles["help-wrapper"]}`}>
                                <h5 className={`${styles["help-title"]}`}>
                                  Yardıma mı ihtiyacın var?
                                </h5>
                                <NavLink
                                  className={`${styles["help-link"]}`}
                                  to={"/sss"}
                                >
                                  Sıkça Sorulan Sorular
                                </NavLink>
                                <NavLink
                                  className={`${styles["help-link"]}`}
                                  to={"/"}
                                >
                                  Satış Sözleşmesi
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className={`${styles["delivery-info-container"]}`}>
                      <div className={`${styles["delivery-title-wrapper"]}`}>
                        <h5 className={`${styles["delivery-title"]}`}>
                          Siparişler&nbsp;({Deliveries!.length})
                        </h5>
                      </div>

                      <div className={`${styles["delivery-content"]}`}>
                        {Deliveries?.map((delivery, index) => (
                          <div
                            key={`delivery-${index}`}
                            className={`${styles["delivery-box"]}`}
                          >
                            <div className={`${styles["delivery-first-box"]}`}>
                              <div
                                className={`${styles["delivery-img-wrapper"]}`}
                              >
                                <img
                                  src={
                                    import.meta.env.VITE_BASE_URL +
                                    delivery.products![0].photo_src
                                  }
                                  alt={delivery.products![0].name}
                                  title={delivery.products![0].name}
                                />
                              </div>

                              <div
                                className={`${styles["delivery-detail-wrapper"]}`}
                              >
                                <h6 className={`${styles["delivered-text"]}`}>
                                  Teslim Edildi
                                </h6>
                                <span
                                  className={`${styles["delivery-products-name"]}`}
                                >
                                  {delivery.products
                                    ?.map((productName) => productName.name)
                                    .join(" - ")}
                                </span>
                                <span className={`${styles["delivered-date"]}`}>
                                  {delivery.deliveryDate} Tarihinde Sipariş
                                  Verildi.
                                </span>
                                <span
                                  className={`${styles["delivery-number"]}`}
                                >
                                  {delivery.deliveryNumber}{" "}
                                  <span
                                    className={`${styles["delivery-number-text"]}`}
                                  >
                                    Numaralı Sipariş
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div
                              className={`${styles["detail-button-wrapper"]}`}
                            >
                              <button
                                onClick={() =>
                                  setDeliveryId(delivery.deliveryNumber)
                                }
                                className={`${styles["delivery-detail-button"]}`}
                              >
                                Detayı Görüntüle
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={`${styles["not-yet-delivery"]}`}>
                  <span className={`${styles["not-delivery"]}`}>
                    Henüz herhangi bir sipariş oluşturmadınız.
                  </span>
                  <NavLink
                    className={`${styles["all-product-link"]}`}
                    to={"/all-products"}
                  >
                    Tüm ürünler
                  </NavLink>
                </div>
              )}
            </>
          )}
          {activeSection === "address" && (
            <div className={`${styles["address-wrapper"]}`}>
              {!isAddress ? (
                <div className={`${styles["without-address-container"]}`}>
                  <div className={`${styles["without-address-title"]}`}>
                    <h5 className={`${styles["address-title"]}`}>
                      Adres Oluştur
                    </h5>
                  </div>

                  <div className={`${styles["address-info-wrapper"]}`}>
                    <span className={`${styles["address-info"]}`}>
                      Kayıtlı bir adresiniz yok. Lütfen aşağıdaki kısımdan adres
                      oluşturunuz.
                    </span>
                  </div>

                  <form
                    onSubmit={handleSubmit(addressSubmit)}
                    action="#"
                    className={`${styles["address-form"]}`}
                  >
                    <label className={`${styles["address-title-label"]}`}>
                      *Adres Başlığı
                    </label>
                    <input
                      {...register("title")}
                      id={`${styles["address-title-input"]}`}
                      type="text"
                      placeholder="ev,iş vb..."
                      required
                    />

                    <label className={`${styles["address-firstName-label"]}`}>
                      *Ad
                    </label>
                    <input
                      {...register("firstName")}
                      id={`${styles["address-firstName-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-lastName-label"]}`}>
                      *Soyad
                    </label>
                    <input
                      {...register("lastName")}
                      id={`${styles["address-lastName-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-label"]}`}>
                      *Adres
                    </label>
                    <input
                      {...register("address")}
                      id={`${styles["address-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-city-label"]}`}>
                      *Şehir
                    </label>
                    <input
                      {...register("city")}
                      id={`${styles["address-city-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-state-label"]}`}>
                      *İlçe
                    </label>
                    <input
                      {...register("state")}
                      id={`${styles["address-state-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-phone-label"]}`}>
                      *Telefon
                    </label>
                    <PhoneInput
                      {...register("phone")}
                      onChange={() => ""}
                      className={`${styles["address-phone-input"]}`}
                      defaultCountry="TR"
                    />

                    <div className={`${styles["address-button-wrapper"]}`}>
                      <button
                        type="submit"
                        className={`${styles["address-submit-button"]}`}
                      >
                        Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={`${styles["with-address-container"]}`}>
                  <div className={`${styles["with-address-title"]}`}>
                    <h5 className={`${styles["address-count-title"]}`}>
                      Adreslerim&nbsp;({address.length})
                    </h5>
                    <button
                      onClick={() => setisAddress(false)}
                      className={`${styles["new-address"]}`}
                    >
                      <i
                        className={`${styles["new-address-icon"]} bi bi-plus-lg`}
                      ></i>
                      Yeni Adres Ekle
                    </button>
                  </div>

                  <div className={`${styles["saved-address-wrapper"]}`}>
                    {address.map((a, index) => (
                      <div key={index} className={`${styles["address-box"]}`}>
                        <div className={`${styles["address-title"]}`}>
                          {a.title}
                        </div>

                        <div className={`${styles["address"]}`}>
                          {`${a.address},${a.state},${a.city}`}
                        </div>

                        <div className={`${styles["delete-edit-wrapper"]}`}>
                          <button
                            onClick={() => handleDeleteAddress(a.address)}
                            className={`${styles["delete-button"]}`}
                          >
                            <i
                              className={`${styles["delete-button-icon"]} bi bi-trash`}
                            ></i>
                            &nbsp;Sil
                          </button>

                          <button
                            className={`${styles["address-edit-button"]}`}
                          >
                            Adresi Düzenle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
