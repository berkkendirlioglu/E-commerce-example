import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { NavLink } from "react-router-dom";
import { navBarStore } from "../../store/navbar-store.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PaymentMethodPayload, shippingMethod } from "../index.ts";
import {
  AddressPayloadType,
  AllAddressType,
  CountriesType,
  RegionType,
  SubRegionType,
} from "../../types/AddressType.ts";
import {
  EditMyAddress,
  GetAllMyAddress,
  OrderToProducts,
} from "../../services/collection/auth.ts";
import { OrderToProductsPayload } from "../../types/PaymentTypes.ts";
import { getRefreshToken } from "../../services/storage.ts";
import PhoneInput from "react-phone-input-2";
import axios from "axios";

const BASE_URL: string = "https://fe1111.projects.academy.onlyjs.com";
const refresh_token = getRefreshToken();

export function Payment() {
  const { basket, setBasket } = navBarStore();
  const { register, control, handleSubmit } = useForm<PaymentMethodPayload>();
  const addressForm = useForm<AddressPayloadType>();
  const [myAddresses, setmyAddresses] = useState<AllAddressType>();
  const [selectedAddress, setselectedAddress] = useState<string>();
  const [activeShipping, setactiveShipping] = useState<string | undefined>(
    shippingMethod.length > 0 ? shippingMethod[0].name : undefined
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [paymentChoise, setPaymentChoise] = useState<string>();
  const [orderNumber, setOrderNumber] = useState<string>();
  const [addressId, setAddressId] = useState<string>("");
  const [handleEditAddress, setHandleEditAddress] = useState<boolean>();
  const [Countries, setCountries] = useState<CountriesType>();
  const [Region, setRegion] = useState<RegionType>();
  const [subRegion, setsubRegion] = useState<SubRegionType>();
  const [selectedCountry, setselectedCountry] = useState<string | null>();
  const [selectedRegion, setselectedRegion] = useState<string | null>();
  const [selectedSubRegion, setselectedSubRegion] = useState<string | null>();

  useEffect(() => {
    const response = axios
      .get(`${BASE_URL}/api/v1/world/countries?limit=252`)
      .then((response) => {
        setCountries(response.data);
      });
    if (!response) {
      throw new Error("Countries can't loading!");
    }
  }, [addressId]);

  useEffect(() => {
    if (selectedCountry === undefined) {
      return;
    }

    const response = axios
      .get(
        `${BASE_URL}/api/v1/world/region?limit=999&offset=0&country-name=${selectedCountry}`
      )
      .then((response) => {
        setRegion(response.data);
      });

    if (!response) {
      throw new Error("Region can't loading!");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedRegion === undefined) {
      return;
    }

    const response = axios
      .get(
        `${BASE_URL}/api/v1/world/subregion?limit=999&offset=0&region-name=${selectedRegion}`
      )
      .then((response) => {
        setsubRegion(response.data);
      });

    if (!response && !subRegion) {
      throw new Error("Subregion can't loading!");
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (!refresh_token || !basket) {
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
    const cardExpirationDate = `${month}-${modifiedYear}`;
    const paymentMethod = paymentChoise;
    const selectedAddressId = selectedAddress;

    const finalData: OrderToProductsPayload = {
      ...data,
      payment_type: paymentMethod,
      card_expiration_date: cardExpirationDate,
      card_type: "VISA",
      address_id: selectedAddressId,
      card_digits: data.card_digits.toString(),
    };

    const response = await OrderToProducts(finalData);

    if (response.status === "success") {
      setOrderNumber(response.data.order_no);
      goToNextStep();
      setBasket(undefined);
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
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const basketUndiscountedPrice = basket?.data.items.reduce(
    (accumulator, item) => {
      return accumulator + item.pieces! * item.unit_price;
    },
    0
  );

  const deliveryAddress = myAddresses?.data.results.filter(
    (address) => address.id === selectedAddress
  );

  const editMyAddress = async (data: AddressPayloadType) => {
    const response = await EditMyAddress({ data, addressId });
    if (response.status === "success") {
      setHandleEditAddress(false);
      const renewedAddress = await GetAllMyAddress();
      setmyAddresses(renewedAddress);
    } else {
      alert("hatalı işlemler mevcut!");
    }
  };

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
                                  onClick={() => {
                                    setAddressId(address.id),
                                      setHandleEditAddress(true);
                                  }}
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
                    {handleEditAddress && (
                      <div className={`${styles["modal-container"]}`}>
                        <div className={`${styles["modal-wrapper"]}`}>
                          <div className={`${styles["modal-title-wrapper"]}`}>
                            <h5 className={`${styles["modal-title"]}`}>
                              Adresi Düzenle
                            </h5>
                            <button
                              className={`${styles["modal-close-button"]}`}
                              onClick={() => setHandleEditAddress(false)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>

                          <div className={`${styles["modal-form-wrapper"]}`}>
                            <form
                              onSubmit={addressForm.handleSubmit(editMyAddress)}
                              action="#"
                              className={`${styles["modal-form"]}`}
                            >
                              <label
                                className={`${styles["address-title-label"]}`}
                              >
                                *Adres Başlığı
                              </label>
                              <input
                                {...addressForm.register("title")}
                                id={`${styles["address-title-input"]}`}
                                type="text"
                                placeholder="ev,iş vb..."
                                required
                              />

                              <label
                                className={`${styles["address-firstName-label"]}`}
                              >
                                *Ad
                              </label>
                              <input
                                {...addressForm.register("first_name")}
                                id={`${styles["address-firstName-input"]}`}
                                type="text"
                                required
                              />

                              <label
                                className={`${styles["address-lastName-label"]}`}
                              >
                                *Soyad
                              </label>
                              <input
                                {...addressForm.register("last_name")}
                                id={`${styles["address-lastName-input"]}`}
                                type="text"
                                required
                              />

                              <label className={`${styles["address-label"]}`}>
                                *Adres
                              </label>
                              <input
                                {...addressForm.register("full_address")}
                                id={`${styles["address-input"]}`}
                                type="text"
                                required
                              />

                              <label
                                className={`${styles["address-city-label"]}`}
                              >
                                *Ülke
                              </label>
                              <select
                                {...addressForm.register("country_id", {
                                  setValueAs: (value) => parseInt(value, 10),
                                })}
                                id={`${styles["address-city-input"]}`}
                                required
                                onChange={(e) => {
                                  const selectedCountryId =
                                    Countries?.data.results.find(
                                      (country) =>
                                        country.id === Number(e.target.value)
                                    );

                                  setselectedCountry(
                                    selectedCountryId
                                      ? selectedCountryId.name
                                      : null
                                  );
                                }}
                                defaultValue={"Ülke"}
                              >
                                <option disabled defaultChecked value="Ülke">
                                  Ülke
                                </option>
                                {Countries?.data.results.map((country) => (
                                  <option key={country.id} value={country.id}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>

                              <label
                                className={`${styles["address-state-label"]}`}
                              >
                                *Şehir
                              </label>
                              <select
                                {...addressForm.register("region_id", {
                                  setValueAs: (value) => parseInt(value, 10),
                                })}
                                id={`${styles["address-state-input"]}`}
                                required
                                defaultValue={"Şehir"}
                                onChange={(e) => {
                                  const selectedRegionId =
                                    Region?.data.results.find(
                                      (region) =>
                                        region.id === Number(e.target.value)
                                    );

                                  setselectedRegion(
                                    selectedRegionId
                                      ? selectedRegionId.name
                                      : null
                                  );
                                }}
                              >
                                <option defaultChecked disabled value="Şehir">
                                  Şehir
                                </option>
                                {Region?.data.results.map((region) => (
                                  <option key={region.id} value={region.id}>
                                    {region.name}
                                  </option>
                                ))}
                              </select>

                              <label
                                className={`${styles["address-subregion-label"]}`}
                              >
                                {!selectedSubRegion && "*İlçe"}
                              </label>
                              <select
                                {...addressForm.register("subregion_id", {
                                  setValueAs: (value) => parseInt(value, 10),
                                })}
                                onChange={(e) => {
                                  const selectedSubregionId =
                                    subRegion?.data.results.find(
                                      (subregion) =>
                                        subregion.id === Number(e.target.value)
                                    );

                                  setselectedSubRegion(
                                    selectedSubregionId
                                      ? selectedSubregionId.name
                                      : null
                                  );
                                }}
                                id={`${styles["address-subregion-input"]}`}
                                required
                                defaultValue={"İlçe"}
                              >
                                <option value="İlçe" defaultChecked disabled>
                                  İlçe
                                </option>
                                {subRegion?.data.results.map((region) => (
                                  <option key={region.id} value={region.id}>
                                    {region.name}
                                  </option>
                                ))}
                              </select>

                              <label
                                className={`${styles["address-phone-label"]}`}
                              >
                                *Telefon
                              </label>

                              <Controller
                                name="phone_number"
                                control={addressForm.control}
                                defaultValue=""
                                rules={{
                                  required: "Telefon numarası zorunludur.",
                                }}
                                render={({
                                  field: { onChange, value },
                                  fieldState: { error },
                                }) => (
                                  <>
                                    <PhoneInput
                                      containerClass={`${styles["address-phone-container"]}`}
                                      inputClass={`${styles["address-phone-input"]}`}
                                      country={"tr"} // Varsayılan ülke: Türkiye
                                      value={value}
                                      onChange={(phone) =>
                                        onChange(`+${phone}`)
                                      }
                                      inputProps={{
                                        name: "phone_number",
                                        required: true,
                                        autoFocus: true,
                                      }}
                                    />
                                    {error && (
                                      <p style={{ color: "red" }}>
                                        {error.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />

                              <div
                                className={`${styles["address-button-wrapper"]}`}
                              >
                                <button
                                  type="submit"
                                  className={`${styles["address-submit-button"]}`}
                                >
                                  Kaydet
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
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
                                            `${e.target.value}-${selectedYear}`
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
