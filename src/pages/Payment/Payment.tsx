import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { navBarStore } from "../../store/NavbarStore";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PaymentMethodPayload } from "../index.ts";
import { NavLink } from "react-router-dom";
import { shippingMethod } from "../../dummyData/shippingMethod";
import { AllAddressType } from "../../types/AddressType.ts";
import { GetAllMyAddress, OrderToProducts } from "../../services/collection/auth.ts";
import { OrderToProductsPayload } from "../../types/PaymentTypes.ts";
import { getRefreshToken } from "../../services/storage.ts";

const BASE_URL: string = "https://fe1111.projects.academy.onlyjs.com";
const refresh_token = getRefreshToken();

function Payment() {
  const { basket , setBasket } = navBarStore();
  const { register, control, handleSubmit } = useForm<PaymentMethodPayload>();
  const [myAddresses, setmyAddresses] = useState<AllAddressType>();
  const [selectedAddress, setselectedAddress] = useState<string>();
  const [activeShipping, setactiveShipping] = useState<string | undefined>(
    shippingMethod.length > 0 ? shippingMethod[0].name : undefined
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentChoise, setPaymentChoise] = useState<string>();
  const [orderNumber, setOrderNumber] = useState<string>();

  useEffect(() => {
    if(!refresh_token || !basket){
      throw new Error();
    }

    const allMyAddress = async () => {
      const response = await GetAllMyAddress();
      setmyAddresses(response);
      setselectedAddress(response.data.results[0].id);
    };
    
    allMyAddress();
  }, []);

  const CompletePayment: SubmitHandler<PaymentMethodPayload> = async (data) => {
    const modifiedDate = data.card_expiration_date;
    const [month, year] = modifiedDate.split("-");
    const modifiedYear = year.slice(-2);
    const cardExpirationDate = `${month}-${modifiedYear}`
    const paymentMethod = paymentChoise;
    const selectedAddressId = selectedAddress;

    const finalData:OrderToProductsPayload = {...data,payment_type:paymentMethod, card_expiration_date:cardExpirationDate,card_type:"VISA", address_id:selectedAddressId, card_digits:data.card_digits.toString() };

    const response = await OrderToProducts(finalData)

    console.log(response);

    if(response.status === "success"){
      setOrderNumber(response.data.order_no);
      goToNextStep();
      setBasket(null)
    }
  };

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleChangeShipping = (id: string) => {
    setactiveShipping(id);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2,"0"));

  const basketUndiscountedPrice = basket?.data.items.reduce(
    (accumulator, item) => {
      return accumulator + item.pieces! * item.unit_price;
    },
    0
  );

  const deliveryAddress = myAddresses?.data.results.filter(
    (address) => address.id === selectedAddress
  );

  return (
    <div className={`${styles["payment-container"]}`}>
      {currentStep === 4 ? (
        <div className={`${styles["complete-delivery-wrapper"]}`}>
          <img width={150} src="https://i.imgur.com/oFOjevY.png" alt="" />
          <h3 className={`${styles["complete-title"]}`}>
            Siparişiniz Başarı ile Alınmıştır!
          </h3>
          <p className={`${styles["complete-text"]}`}>
            Aşağıdaki sipariş kodu ile siparişinizi kontrol edebilirsiniz.
          </p>
          <p className={`${styles["delivery-number"]}`}>
            Sipariş No: {orderNumber}
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
                    myAddresses?.data.results.length! > 0
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  1
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div
                  onClick={() => setCurrentStep(1)}
                  className={`${styles["step-title-wrapper"]}`}
                >
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
                    {myAddresses?.data.results.length! > 0 ? (
                      <div className={`${styles["optional-select-form"]}`}>
                        {myAddresses?.data.results.map((address, index) => (
                          <label
                            key={index}
                            className={`${styles["optional-label"]} ${
                              selectedAddress === address.id
                                ? styles["selected-option"]
                                : ""
                            }`}
                          >
                            <div
                              className={`${styles["optional-input-wrapper"]}`}
                            >
                              <input
                                className={`${styles["optional-checkbox"]}`}
                                type="checkbox"
                                name="address"
                                value={address.id}
                                checked={selectedAddress === address.id}
                                onChange={() => setselectedAddress(address.id)}
                              />
                              <span className={`${styles["custom-checkbox"]}`}>
                                <span className={`${styles["check-icon"]}`}>
                                  ✓
                                </span>
                              </span>
                            </div>

                            <div className={`${styles["optional-title-full"]}`}>
                              <div
                                className={`${styles["optional-title-wrapper"]}`}
                              >
                                <strong
                                  className={`${styles["optional-title"]}`}
                                >
                                  {address.title}
                                </strong>
                                <button
                                  onClick={() => console.log("edit address")}
                                  className={`${styles["edit-address-button"]}`}
                                >
                                  Düzenle
                                </button>
                              </div>
                              <div className={`${styles["optional-full"]}`}>
                                {`${address.full_address}, ${address.subregion.name} ,${address.region.name}, ${address.country.name},`}
                              </div>
                            </div>
                          </label>
                        ))}

                        <button
                          onClick={() => goToNextStep()}
                          className={`${styles["next-step-button"]}`}
                        >
                          Kargo ile Devam Et
                        </button>
                      </div>
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
                    currentStep === 3
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  2
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div
                  onClick={() => setCurrentStep(2)}
                  className={`${styles["step-title-wrapper"]}`}
                >
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
                    <div className={`${styles["optional-select-form"]}`}>
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
                              className={`${styles["optional-checkbox"]}`}
                              type="checkbox"
                              name="shipping"
                              value={JSON.stringify(shippingMethod[i].name)}
                              checked={activeShipping === shipping.name}
                              onChange={() =>
                                handleChangeShipping(shipping.name)
                              }
                            />
                            <span className={`${styles["custom-checkbox"]}`}>
                              <span className={`${styles["check-icon"]}`}>
                                ✓
                              </span>
                            </span>
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

                      <button
                        onClick={() => goToNextStep()}
                        className={`${styles["next-step-button"]}`}
                      >
                        Ödeme ile Devam et
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles["step-by-proccess"]}`}>
              <div className={`${styles["current-step"]}`}>
                <span
                  className={`${styles["step"]} ${
                    currentStep === 3
                      ? styles["complete-step"]
                      : styles["not-complete-step"]
                  }`}
                >
                  3
                </span>
              </div>

              <div className={`${styles["step-content"]}`}>
                <div
                  onClick={() => setCurrentStep(3)}
                  className={`${styles["step-title-wrapper"]}`}
                >
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
                    <div className={`${styles["payment-choise-wrapper"]}`}>
                      <select
                        className={`${styles["payment-choise-input"]}`}
                        defaultValue={"payment-choise"}
                        onChange={(e) => setPaymentChoise(e.target.value)}
                      >
                        <option defaultChecked disabled value="payment-choise">
                          Ödeme Yöntemini Seçin...
                        </option>
                        <option value="credit_cart">Kredi Kartı</option>
                        <option value="credit_cart_at_door">
                          Kapıda Kredi Kartı
                        </option>
                        <option value="cash_at_door">Kapıda Nakit</option>
                      </select>
                    </div>
                    {paymentChoise === "credit_cart" && (
                      <form
                        onSubmit={handleSubmit(CompletePayment)}
                        className={`${styles["optional-select-form"]}`}
                      >
                        <label htmlFor="fullName">
                          Kart Üzerindeki İsim Soyisim*
                        </label>
                        <input
                          name="fullName"
                          type="text"
                          id={`${styles["fullName"]}`}
                        />
                        <label htmlFor="card_digits">Kart Numarası*</label>
                        <input
                          {...register("card_digits")}
                          name="card_digits"
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
                              <Controller
                                name="card_expiration_date"
                                control={control}
                                render={({ field }) => {
                                  const { onChange, value } = field;

                                  const [selectedMonth, selectedYear] =
                                    value?.split("-") || [months[0], years[0]];

                                  return (
                                    <div>
                                      <select
                                        name="month"
                                        id="month"
                                        value={selectedMonth}
                                        onChange={(e) =>
                                          onChange(
                                            `${
                                              e.target.value
                                            }-${selectedYear}`
                                          )
                                        }
                                      >
                                        {months.map((month, index) => (
                                          <option key={index} value={month}>
                                            {month}
                                          </option>
                                        ))}
                                      </select>

                                      <select
                                        name="year"
                                        id="year"
                                        value={selectedYear}
                                        onChange={(e) =>
                                          onChange(
                                            `${selectedMonth}-${e.target.value}`
                                          )
                                        }
                                      >
                                        {years.map((year, index) => (
                                          <option key={index} value={year}>
                                            {year}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                }}
                              />
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
                              {...register("card_security_code")}
                              type="text"
                              maxLength={4}
                            />
                          </label>
                        </div>

                        <button className={`${styles["next-step-button"]}`}>
                          Ödemeyi Tamamla
                        </button>
                      </form>
                    )}
                    {(paymentChoise === "credit_cart_at_door" ||
                      paymentChoise === "cash_at_door") && (
                      <div className={`${styles["payment-address-wrapper"]}`}>
                        <h5>Sipariş Adresi</h5>
                        {deliveryAddress?.map((address) => (
                          <div
                            key={address.id}
                            className={`${styles["payment-address-content"]}`}
                          >
                            <span
                              className={`${styles["payment-full-name"]}`}
                            >{`${address.first_name} ${address.last_name}`}</span>
                            <span
                              className={`${styles["payment-address-title"]}`}
                            >
                              {address.title}
                            </span>
                            <span
                              className={`${styles["payment-full-address"]}`}
                            >{`${address.full_address}, ${address.country.name}, ${address.region.name}, ${address.subregion.name}`}</span>
                            <span>{`${address.phone_number}`}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["basket-products-wrapper"]}`}>
            <div className={`${styles["basket-product-content"]}`}>
              {basket?.data.items.map((products, index) => (
                <div className={`${styles["product-card"]}`} key={index}>
                  <div className={`${styles["product-first-content"]}`}>
                    <div className={`${styles["product-img-wrapper"]}`}>
                      <img
                        src={
                          BASE_URL + products.product_variant_detail.photo_src
                        }
                        alt={products.product}
                      />
                      <div className={`${styles["product-count"]}`}>
                        {products.pieces}
                      </div>
                    </div>
                    <div className={`${styles["product-detail-wrapper"]}`}>
                      <p className={`${styles["product-name"]}`}>
                        {products.product}
                      </p>
                      <p className={`${styles["product-gram-flavor"]}`}>
                        {products.product_variant_detail.aroma === "Aromasız"
                          ? ""
                          : `${products.product_variant_detail.aroma} / `}
                        {products.product_variant_detail.size.gram
                          ? `${products.product_variant_detail.size.gram}G`
                          : `${products.product_variant_detail.size.pieces} Adet`}
                      </p>
                    </div>
                  </div>
                  <div className={`${styles["product-second-content"]}`}>
                    <p className={`${styles["product-price"]}`}>
                      {products.total_price.toLocaleString("tr-TR")} TL
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles["total-price-wrapper"]}`}>
              <div className={`${styles["undiscounted-price-wrapper"]}`}>
                <p>Ara Toplam</p>
                <p>{basketUndiscountedPrice?.toLocaleString("tr-TR")} TL</p>
              </div>

              <div className={`${styles["product-total-price"]}`}>
                <p>Toplam</p>
                <p>{basket?.data.total_price} TL</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
