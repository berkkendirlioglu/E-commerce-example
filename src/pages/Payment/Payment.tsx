import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { navBarStore } from "../../store/NavbarStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddressType, submitFormType, DeliveryType } from "../index.ts";
import { NavLink } from "react-router-dom";
import { shippingMethod } from "../../dummyData/shippingMethod";

function Payment() {
  const [savedAddress, setsavedAddress] = useState<AddressType[]>(() => {
    const address = localStorage.getItem("address");
    return address ? JSON.parse(address) : [];
  });

  const { basket, setBasket } = navBarStore();

  const { register, handleSubmit } = useForm<submitFormType>();

  const [activeAddress, setactiveAddress] = useState<string | undefined>(
    savedAddress.length > 0 ? savedAddress[0].title : undefined
  );
  const [activeShipping, setactiveShipping] = useState<string | undefined>(
    shippingMethod.length > 0 ? shippingMethod[0].name : undefined
  );
  const [deliveryProducts, setdeliveryProducts] =
    useState<DeliveryType>();

  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    setsavedAddress(() => {
      const arrayAddress = localStorage.getItem("address");
      return arrayAddress ? JSON.parse(arrayAddress) : [];
    })
  }, []);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleDeliveryAddressForm: SubmitHandler<submitFormType> = (data) => {
    const arrayAddress: AddressType = JSON.parse(data.address);
    setdeliveryProducts(() => ({
      products: basket,
      address: arrayAddress,
    }));
    goToNextStep();
  };

  const handleDeliveryShippingForm: SubmitHandler<submitFormType> = (data) => {
    const shippingObj = data.shipping ? JSON.parse(data.shipping) : undefined;
    setdeliveryProducts((delivery) => ({
      ...delivery,
      shipping: shippingObj,
    }));
    goToNextStep();
  };

  const handleDeliveryCreditCardForm: SubmitHandler<submitFormType> = (
    data
  ) => {
    const creditCardObject = {
      cardMonth: data.cardMonth,
      cardNumber: data.cardNumber,
      cvvCode: data.cvvCode,
      fullName: data.fullName,
      cardYear: data.cardYear,
    };

    const currentDate: string = new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const deliveryNumber = Math.random().toString().slice(2, 16);
    setdeliveryProducts((delivery) => {
      const updatedDelivery = {
        ...delivery,
        payment: creditCardObject,
        deliveryNumber: deliveryNumber,
        deliveryDate: currentDate,
      };

      const existingDeliveries = JSON.parse(
        localStorage.getItem("completeDelivery") || "[]"
      );

      if (Array.isArray(existingDeliveries)) {
        existingDeliveries.push(updatedDelivery);
      }

      localStorage.setItem(
        "completeDelivery",
        JSON.stringify(existingDeliveries)
      );

      return updatedDelivery;
    });

    goToNextStep();

    setBasket([]);

    setTimeout(() => {
      localStorage.removeItem("basket");
    }, 1000);
  };

  const handleChangeAddress = (title: string) => {
    setactiveAddress(title);
  };
  const handleChangeShipping = (title: string) => {
    setactiveShipping(title);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const basketUndiscountedPrice = basket.reduce((accumulator, item) => {
    return accumulator + item.count! * item.price.total_price;
  }, 0);

  const basketTotalPrice = basket.reduce((accumulator, item) => {
    return item.price.discounted_price ? accumulator + item.count! * item.price.discounted_price! : accumulator + item.count! * item.price.total_price!;
  }, 0);

  return (
    <div className={`${styles["payment-container"]}`}>
      {currentStep === 4 ? (
        <div className={`${styles["complete-delivery-wrapper"]}`}>
          <img
            width={150}
            src="https://toppng.com/uploads/preview/like-yellow-icon-like-icon-yellow-11553392640ctcuya9tln.png"
            alt=""
          />
          <h3 className={`${styles["complete-title"]}`}>
            Siparişiniz Başarı ile Alınmıştır!
          </h3>
          <p className={`${styles["complete-text"]}`}>
            Aşağıdaki sipariş kodu ile siparişinizi kontrol edebilirsiniz.
          </p>
          <p className={`${styles["delivery-number"]}`}>
            Sipariş No: {deliveryProducts?.deliveryNumber}
          </p>
          <NavLink
            className={`${styles["my-account-link"]}`}
            to={"/my-account"}
          >
            Hesabım
          </NavLink>
        </div>
      ) : (
        <div className={`${styles["payment-wrapper"]}`}>
          <div className={`${styles["payment-proccess-wrapper"]}`}>
            <div className={`${styles["step-by-proccess"]}`}>
              <div className={`${styles["current-step"]}`}>
                <span
                  className={`${styles["step"]} ${
                    deliveryProducts?.address
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  1
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div className={`${styles["step-title-wrapper"]}`}>
                  <h5 className={`${styles["step-title"]}`}>Adres</h5>
                </div>

                <div
                  className={`${styles["current-step-content"]} ${
                    currentStep === 1
                      ? styles["active-tab"]
                      : styles["close-tab"]
                  }`}
                >
                  <div className={`${styles["second-title-wrapper"]}`}>
                    <span className={`${styles["second-title"]}`}>
                      Teslimat Adresi
                    </span>
                  </div>

                  <div className={`${styles["optional-select-wrapper"]}`}>
                    {savedAddress.length > 0 ? (
                      <form
                        onSubmit={handleSubmit(handleDeliveryAddressForm)}
                        className={`${styles["optional-select-form"]}`}
                      >
                        {savedAddress.map((address, index) => (
                          <label
                            key={index}
                            className={`${styles["optional-label"]} ${
                              activeAddress === address.title
                                ? styles["selected-option"]
                                : ""
                            }`}
                          >
                            <div
                              className={`${styles["optional-input-wrapper"]}`}
                            >
                              <input
                                {...register("address")}
                                className={`${styles["optional-checkbox"]}`}
                                type="checkbox"
                                name="address"
                                value={JSON.stringify(savedAddress[index])}
                                checked={activeAddress === address.title}
                                onChange={() =>
                                  handleChangeAddress(address.title)
                                }
                              />
                            </div>

                            <div className={`${styles["optional-title-full"]}`}>
                              <strong className={`${styles["optional-title"]}`}>
                                {address.title}
                              </strong>
                              <div
                                className={`${styles["optional-full"]}`}
                              >{`${address.address}, ${address.state}, ${address.city}`}</div>
                            </div>
                          </label>
                        ))}

                        <button className={`${styles["next-step-button"]}`}>
                          Kargo ile Devam Et
                        </button>
                      </form>
                    ) : (
                      <div className={`${styles["havent-address-wrapper"]}`}>
                        <h4 className={`${styles["havent-address-text"]}`}>
                          Kayıtlı herhangi bir adresiniz yok. Lütfen hesap
                          ayarlarından yeni bir adres oluşturun.
                        </h4>
                        <NavLink
                          className={`${styles["create-address-link"]}`}
                          to={"/my-account"}
                        >
                          Adreslerim
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles["step-by-proccess"]}`}>
              <div className={`${styles["current-step"]}`}>
                <span
                  className={`${styles["step"]} ${
                    deliveryProducts?.shipping
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  2
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div className={`${styles["step-title-wrapper"]}`}>
                  <h5 className={`${styles["step-title"]}`}>Kargo</h5>
                </div>

                <div
                  className={`${styles["current-step-content"]} ${
                    currentStep === 2
                      ? styles["active-tab"]
                      : styles["close-tab"]
                  }`}
                >
                  <div className={`${styles["second-title-wrapper"]}`}>
                    <span className={`${styles["second-title"]}`}>
                      Kargo Seçimi
                    </span>
                  </div>

                  <div className={`${styles["optional-select-wrapper"]}`}>
                    <form
                      onSubmit={handleSubmit(handleDeliveryShippingForm)}
                      className={`${styles["optional-select-form"]}`}
                    >
                      {shippingMethod.map((shipping, i) => (
                        <label
                          key={i}
                          className={`${styles["optional-label"]} ${
                            activeShipping === shipping.name
                              ? styles["selected-option"]
                              : ""
                          }`}
                        >
                          <div
                            className={`${styles["optional-input-wrapper"]}`}
                          >
                            <input
                              {...register("shipping")}
                              className={`${styles["optional-checkbox"]}`}
                              type="checkbox"
                              name="shipping"
                              value={JSON.stringify(shippingMethod[i].name)}
                              checked={activeShipping === shipping.name}
                              onChange={() =>
                                handleChangeShipping(shipping.name)
                              }
                            />
                          </div>

                          <div className={`${styles["optional-title-full"]}`}>
                            <strong className={`${styles["optional-title"]}`}>
                              {shipping.name}
                            </strong>
                            <div className={`${styles["optional-full"]}`}>
                              {shipping.content}
                            </div>
                          </div>
                        </label>
                      ))}

                      <button className={`${styles["next-step-button"]}`}>
                        Ödeme ile Devam et
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles["step-by-proccess"]}`}>
              <div className={`${styles["current-step"]}`}>
                <span
                  className={`${styles["step"]} ${
                    deliveryProducts?.payment
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  3
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div className={`${styles["step-title-wrapper"]}`}>
                  <h5 className={`${styles["step-title"]}`}>Ödeme</h5>
                </div>

                <div
                  className={`${styles["current-step-content"]} ${
                    currentStep === 3
                      ? styles["active-tab"]
                      : styles["close-tab"]
                  }`}
                >
                  <div className={`${styles["second-title-wrapper"]}`}>
                    <span className={`${styles["second-title"]}`}>
                      Ödeme Yöntemi
                    </span>
                  </div>

                  <div className={`${styles["optional-select-wrapper"]}`}>
                    <form
                      onSubmit={handleSubmit(handleDeliveryCreditCardForm)}
                      className={`${styles["optional-select-form"]}`}
                    >
                      <label htmlFor="fullName">
                        Kart Üzerindeki İsim Soyisim*
                      </label>
                      <input
                        {...register("fullName")}
                        name="fullName"
                        type="text"
                        id={`${styles["fullName"]}`}
                      />
                      <label htmlFor="cardNumber">Kart Numarası*</label>
                      <input
                        {...register("cardNumber")}
                        name="cardNumber"
                        type="text"
                        maxLength={16}
                        id={`${styles["cardNumber"]}`}
                      />

                      <div className={`${styles["expired-cvv-wrapper"]}`}>
                        <label
                          className={`${styles["expired-date-wrapper"]}`}
                          htmlFor="expiredDate"
                        >
                          <span>Son Kullanma Tarihi*</span>
                          <div className={`${styles["expired-date-inputs"]}`}>
                            <select
                              {...register("cardMonth")}
                              name="months"
                              id="month"
                            >
                              {months.map((month, index) => (
                                <option key={index} value={month}>
                                  {month}
                                </option>
                              ))}
                            </select>

                            <select
                              {...register("cardYear")}
                              name="years"
                              id="year"
                            >
                              {years.map((year, index) => (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </label>

                        <label
                          className={`${styles["cvv-code-wrapper"]}`}
                          htmlFor="cvvCode"
                        >
                          <div>
                            CVV*&nbsp;
                            <span></span>
                          </div>
                          <input
                            {...register("cvvCode")}
                            type="text"
                            maxLength={4}
                          />
                        </label>
                      </div>

                      <button className={`${styles["next-step-button"]}`}>
                        Ödeme ile Devam et
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["basket-products-wrapper"]}`}>
            <div className={`${styles["basket-product-content"]}`}>
              {basket.map((products, index) => (
                <div className={`${styles["product-card"]}`} key={index}>
                  <div className={`${styles["product-first-content"]}`}>
                    <div className={`${styles["product-img-wrapper"]}`}>
                      <img
                        src={import.meta.env.VITE_BASE_URL + products.photo_src}
                        alt={products.name}
                      />
                      <div className={`${styles["product-count"]}`}>
                        {products.count}
                      </div>
                    </div>
                    <div className={`${styles["product-detail-wrapper"]}`}>
                      <p className={`${styles["product-name"]}`}>
                        {products.name}
                      </p>
                      <p className={`${styles["product-gram-flavor"]}`}>
                        {products.aroma && products.aroma === "Aromasız"
                          ? ""
                          : `${products.aroma} / `}
                        {products.size.gram
                          ? `${products.size.gram}G`
                          : `${products.size.pieces} Adet`}
                      </p>
                    </div>
                  </div>
                  <div className={`${styles["product-second-content"]}`}>
                    <p className={`${styles["product-price"]}`}>
                      {(
                        products.count! * products.price.total_price
                      ).toLocaleString("tr-TR")}{" "}
                      TL
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles["total-price-wrapper"]}`}>
              <div className={`${styles["undiscounted-price-wrapper"]}`}>
                <p>Ara Toplam</p>
                <p>{basketUndiscountedPrice.toLocaleString("tr-TR")} TL</p>
              </div>

              <div className={`${styles["product-total-price"]}`}>
                <p>Toplam</p>
                <p>{basketTotalPrice.toLocaleString("tr-TR")} TL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
