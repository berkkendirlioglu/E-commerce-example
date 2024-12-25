import { FormEvent, useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { navBarStore } from "../../store/NavbarStore.ts";
import { NavLink } from "react-router-dom";
import {
  CreateNewAddress,
  DeleteMyAddress,
  EditMyAddress,
  GetAllMyAddress,
  GetMyAllOrder,
  GetMyOrderDetails,
  UpdateMyProfile,
} from "../../services/collection/auth.ts";
import { UpdateProfileType } from "../../types/AccountType.ts";
import {
  RegionType,
  CountriesType,
  SubRegionType,
  AllAddressType,
} from "../../types/AddressType.ts";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AddressPayloadType } from "../../types/AddressType.ts";
import { AllOrderTypes, OrderDetailsType } from "../../types/OrderTypes.ts";
import { getAccessToken } from "../../services/storage.ts";

const BASE_URL: string = "https://fe1111.projects.academy.onlyjs.com";
const access_token = getAccessToken();

export function MyAccount() {
  if (!access_token) {
    throw new Error("Access token is invalid");
  }

  const [activeSection, setactiveSection] = useState<
    "accountInfo" | "delivery" | "address"
  >("accountInfo");

  const { register, control, handleSubmit } = useForm<AddressPayloadType>();
  const { profileDetail } = navBarStore();
  const [Countries, setCountries] = useState<CountriesType>();
  const [Region, setRegion] = useState<RegionType>();
  const [subRegion, setsubRegion] = useState<SubRegionType>();
  const [address, setAddress] = useState<AllAddressType>();
  const [addressId, setaddressId] = useState<string>("");
  const [selectedCountry, setselectedCountry] = useState<string | null>();
  const [selectedRegion, setselectedRegion] = useState<string | null>();
  const [selectedSubRegion, setselectedSubRegion] = useState<string | null>();
  const [isAddress, setisAddress] = useState<boolean>();
  const [handleEditAddress, setHandleEditAddress] = useState<boolean>();
  const [myOrders, setMyOrders] = useState<AllOrderTypes>();
  const [orderId, setOrderId] = useState<string>();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>();

  useEffect(() => {
    const response = axios
      .get(`${BASE_URL}/api/v1/world/countries?limit=252`)
      .then((response) => {
        setCountries(response.data);
      });
    if (!response) {
      throw new Error("Countries can't loading!");
    }

    const allMyAddress = async () => {
      const response = await GetAllMyAddress();

      setAddress(response);
      setisAddress(response.data.count > 0 ? true : false);
    };
    allMyAddress();
  }, [activeSection === "address"]);

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
    const getAllMyOrders = async () => {
      const response = await GetMyAllOrder();

      if (response.status === "success") {
        setMyOrders(response);
      } else {
        alert("Siparişler getirilirken bir hata meydana geldi.");
      }
    };
    getAllMyOrders();
  }, []);

  useEffect(() => {
    if (orderId === undefined) {
      setOrderDetails(undefined);
      return;
    }
    const getOrderDetail = async () => {
      const response = await GetMyOrderDetails(orderId!);

      if (response.status === "success") {
        setOrderDetails(response);
      } else {
        alert("Sipariş detayları getirilirken bir hata meydana geldi.");
      }
    };
    getOrderDetail();
  }, [orderId]);

  const updateProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData) as unknown as UpdateProfileType;
    const modifiyedData = {
      ...data,
      phone_number: data.phone_number.replace(/\s+/g, ""),
    };

    await UpdateMyProfile(modifiyedData);

    window.location.reload();
  };

  const addressSubmit: SubmitHandler<AddressPayloadType> = async (data) => {
    await CreateNewAddress(data);
    setisAddress(true);
    const renewedAddress = await GetAllMyAddress();
    setAddress(renewedAddress);
  };

  const deleteMyAddress = async (addressId: string) => {
    await DeleteMyAddress(addressId);
    const renewedAddress = await GetAllMyAddress();
    setAddress(renewedAddress);
    setisAddress(renewedAddress.data.count <= 0 ? false : true);
  };

  const editMyAddress = async (data: AddressPayloadType) => {
    const response = await EditMyAddress({ data, addressId });
    if (response.status === "success") {
      setHandleEditAddress(false);
      const renewedAddress = await GetAllMyAddress();
      setAddress(renewedAddress);
    } else {
      alert("hatalı işlemler mevcut!");
    }
  };

  const filteredOrderDate = myOrders?.data.filter(
    (date) => date.order_no === orderId
  );

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
                onSubmit={updateProfileSubmit}
                className={`${styles["account-info-form"]}`}
                action="#"
              >
                <label className={`${styles["firstName"]}`} htmlFor="firstName">
                  *Ad
                </label>
                <input
                  name="first_name"
                  type="text"
                  id={`${styles["firstName"]}`}
                  autoFocus
                />

                <label className={`${styles["lastName"]}`} htmlFor="lastName">
                  *Soyad
                </label>
                <input
                  name="last_name"
                  type="text"
                  id={`${styles["lastName"]}`}
                />

                <label className={`${styles["phone"]}`} htmlFor="phone">
                  Telefon
                </label>

                <Controller
                  name="phone_number"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Telefon numarası zorunludur." }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <PhoneInput
                        containerClass={`${styles["phone-input-container"]}`}
                        inputClass={`${styles["phone-input"]}`}
                        country={"tr"} // Varsayılan ülke: Türkiye
                        value={value}
                        onChange={(phone) => onChange(`+${phone}`)}
                        inputProps={{
                          name: "phone_number",
                          required: true,
                        }}
                      />
                      {error && <p style={{ color: "red" }}>{error.message}</p>}
                    </>
                  )}
                />

                <label className={`${styles["email"]}`} htmlFor="email">
                  E-Posta
                </label>
                <input
                  type="email"
                  id={`${styles["email"]}`}
                  disabled
                  value={profileDetail?.data.email}
                />

                <div className={`${styles["info-button-wrapper"]}`}>
                  <button className={`${styles["info-button"]}`}>Kaydet</button>
                </div>
              </form>
            </div>
          )}
          {activeSection === "delivery" && (
            <>
              {myOrders?.data.length! > 0 ? (
                <>
                  {orderId ? (
                    <div className={`${styles["delivery-detail-container"]}`}>
                      <button
                        onClick={() => setOrderId(undefined)}
                        className={`${styles["delivery-back-button"]}`}
                      >
                        <i className="bi bi-arrow-left"></i>&nbsp;Geri
                      </button>

                      <div className={`${styles["detail-title-wrapper"]}`}>
                        <span className={`${styles["delivery-status"]}`}>
                          {orderDetails?.data.order_status === "in_cargo"
                            ? "Kargoya Verildi."
                            : orderDetails?.data.order_status === "delivered"
                            ? "Teslim Edildi"
                            : "Siparişiniz Hazırlanıyor"}
                        </span>
                        <span>
                          <strong>
                            {new Date(
                              filteredOrderDate?.[0]?.created_at!
                            ).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>{" "}
                          Tarihinde Sipariş Verildi.
                          <span>
                            &nbsp;<strong>{orderDetails?.data.order_no}</strong>{" "}
                            numaralı sipariş
                          </span>
                        </span>
                      </div>

                      <div className={`${styles["delivery-detail-content"]}`}>
                        <div className={`${styles["product-detail-wrapper"]}`}>
                          {orderDetails?.data.shopping_cart!.items.map(
                            (product, index) => (
                              <div
                                key={`delivery-product-${index}`}
                                className={`${styles["product-box"]}`}
                              >
                                <div
                                  className={`${styles["product-img-wrapper"]}`}
                                >
                                  <img
                                    src={
                                      BASE_URL +
                                      product.product_variant_detail.photo_src
                                    }
                                    alt=""
                                  />
                                </div>
                                <div
                                  className={`${styles["product-name-detail"]}`}
                                >
                                  <p className={`${styles["product-name"]}`}>
                                    {product.product} x {product.pieces}
                                  </p>
                                  <p className={`${styles["product-price"]}`}>
                                    {product.total_price}
                                    &nbsp;TL
                                  </p>
                                  <p className={`${styles["product-size"]}`}>
                                    Boyut:{" "}
                                    {!product.product_variant_detail.size.gram
                                      ? `${product.product_variant_detail.size.pieces} Kutu`
                                      : `${product.product_variant_detail.size.gram}G`}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                          {orderDetails?.data.shipment_tracking_number && (
                            <div
                              className={`${styles["product-shipping-detail"]}`}
                            >
                              <p>
                                Kargo Takip Numarası:&nbsp;
                                <strong>
                                  {orderDetails?.data.shipment_tracking_number}
                                </strong>{" "}
                              </p>
                            </div>
                          )}
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
                            {/* <span className={`${styles["user-fullName"]}`}>
                              {orderDetails?.data.address +
                                " " +
                                deliveriesDetail[0].address!.lastName}
                            </span> */}
                            <span className={`${styles["full-address"]}`}>
                              {orderDetails?.data.address.full_address}/{" "}
                              {orderDetails?.data.address.subregion}/{" "}
                              {orderDetails?.data.address.region}/{" "}
                              {orderDetails?.data.address.country}
                            </span>
                          </div>
                          <div className={`${styles["credit-card-wrapper"]}`}>
                            <span className={`${styles["credit-card-items"]}`}>
                              {orderDetails?.data.payment_detail.card_type} -{" "}
                              {orderDetails?.data.payment_detail.final_price.toLocaleString(
                                "tr-TR"
                              )}
                              &nbsp;TL
                            </span>
                            <span className={`${styles["credit-card-items"]}`}>
                              {orderDetails?.data.payment_detail.card_digits
                                ?.replace(/.(?=.{2})/g, "*")
                                .match(/.{1,4}/g)
                                ?.join(" ")}
                            </span>
                          </div>
                          <div className={`${styles["price-details-wrapper"]}`}>
                            <h6 className={`${styles["price-detail-title"]}`}>
                              Özet
                            </h6>
                            <div className={`${styles["price-details"]}`}>
                              <span>Ara Toplam</span>
                              <span>
                                {orderDetails?.data.shopping_cart.total_price.toLocaleString(
                                  "tr-TR"
                                )}{" "}
                                TL
                              </span>
                            </div>
                            <div className={`${styles["price-details"]}`}>
                              <span>Kargo</span>
                              <span>
                                {orderDetails?.data.payment_detail.shipment_fee.toLocaleString(
                                  "tr-TR"
                                )}{" "}
                                TL
                              </span>
                            </div>
                            <div className={`${styles["price-details"]}`}>
                              <span>Toplam Vergi</span>
                              <span>
                                {(
                                  orderDetails?.data.payment_detail
                                    .final_price! * 0.18
                                ).toFixed(2)}{" "}
                                TL
                              </span>
                            </div>
                            <div className={`${styles["price-details"]}`}>
                              <span>
                                Yüzde&nbsp;
                                {
                                  orderDetails?.data.payment_detail
                                    .discount_ratio
                                }
                                &nbsp;indirim!
                              </span>
                              <span>
                                {orderDetails?.data.payment_detail.discount_amount.toLocaleString(
                                  "tr-TR"
                                )}{" "}
                                TL
                              </span>
                            </div>
                            <div className={`${styles["price-details"]}`}>
                              <span>Toplam</span>
                              <span>
                                {orderDetails?.data.payment_detail.final_price?.toLocaleString(
                                  "tr-TR"
                                )}{" "}
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
                  ) : (
                    <div className={`${styles["delivery-info-container"]}`}>
                      <div className={`${styles["delivery-title-wrapper"]}`}>
                        <h5 className={`${styles["delivery-title"]}`}>
                          Siparişler&nbsp;({myOrders?.data.length})
                        </h5>
                      </div>

                      <div className={`${styles["delivery-content"]}`}>
                        {myOrders?.data?.map((delivery, index) => (
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
                                    delivery.cart_detail.length > 0
                                      ? BASE_URL +
                                        delivery.cart_detail[0].photo_src
                                      : `https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png`
                                  }
                                  alt={"order alt"}
                                  title={"order title"}
                                />
                              </div>

                              <div
                                className={`${styles["delivery-detail-wrapper"]}`}
                              >
                                <h6 className={`${styles["delivered-text"]}`}>
                                  {delivery.order_status === "in_cargo"
                                    ? "Kargoya Verildi."
                                    : delivery.order_status === "delivered"
                                    ? "Teslim Edildi"
                                    : "Siparişiniz Hazırlanıyor"}
                                </h6>
                                <span
                                  className={`${styles["delivery-products-name"]}`}
                                >
                                  {delivery.cart_detail
                                    ?.map((productName) => productName.name)
                                    .join(" - ")}
                                </span>
                                <span className={`${styles["delivered-date"]}`}>
                                  {new Date(
                                    delivery.created_at
                                  ).toLocaleDateString("tr-TR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  Tarihinde Sipariş Verildi.
                                </span>
                                <span
                                  className={`${styles["delivery-number"]}`}
                                >
                                  {delivery.order_no}{" "}
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
                                onClick={() => setOrderId(delivery.order_no)}
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

                  {address?.data.count! <= 0 && (
                    <div className={`${styles["address-info-wrapper"]}`}>
                      <span className={`${styles["address-info"]}`}>
                        Kayıtlı bir adresiniz yok. Lütfen aşağıdaki kısımdan
                        adres oluşturunuz.
                      </span>
                    </div>
                  )}

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
                      {...register("first_name")}
                      id={`${styles["address-firstName-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-lastName-label"]}`}>
                      *Soyad
                    </label>
                    <input
                      {...register("last_name")}
                      id={`${styles["address-lastName-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-label"]}`}>
                      *Adres
                    </label>
                    <input
                      {...register("full_address")}
                      id={`${styles["address-input"]}`}
                      type="text"
                      required
                    />

                    <label className={`${styles["address-city-label"]}`}>
                      *Ülke
                    </label>
                    <select
                      {...register("country_id", {
                        setValueAs: (value) => parseInt(value, 10),
                      })}
                      id={`${styles["address-city-input"]}`}
                      required
                      onChange={(e) => {
                        const selectedCountryId = Countries?.data.results.find(
                          (country) => country.id === Number(e.target.value)
                        );

                        setselectedCountry(
                          selectedCountryId ? selectedCountryId.name : null
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

                    <label className={`${styles["address-state-label"]}`}>
                      *Şehir
                    </label>
                    <select
                      {...register("region_id", {
                        setValueAs: (value) => parseInt(value, 10),
                      })}
                      id={`${styles["address-state-input"]}`}
                      required
                      defaultValue={"Şehir"}
                      onChange={(e) => {
                        const selectedRegionId = Region?.data.results.find(
                          (region) => region.id === Number(e.target.value)
                        );

                        setselectedRegion(
                          selectedRegionId ? selectedRegionId.name : null
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

                    <label className={`${styles["address-subregion-label"]}`}>
                      {!selectedSubRegion && "*İlçe"}
                    </label>
                    <select
                      {...register("subregion_id", {
                        setValueAs: (value) => parseInt(value, 10),
                      })}
                      onChange={(e) => {
                        const selectedSubregionId =
                          subRegion?.data.results.find(
                            (subregion) =>
                              subregion.id === Number(e.target.value)
                          );

                        setselectedSubRegion(
                          selectedSubregionId ? selectedSubregionId.name : null
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

                    <label className={`${styles["address-phone-label"]}`}>
                      *Telefon
                    </label>

                    <Controller
                      name="phone_number"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Telefon numarası zorunludur." }}
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
                            onChange={(phone) => onChange(`+${phone}`)}
                            inputProps={{
                              name: "phone_number",
                              required: true,
                              autoFocus: true,
                            }}
                          />
                          {error && (
                            <p style={{ color: "red" }}>{error.message}</p>
                          )}
                        </>
                      )}
                    />

                    <div className={`${styles["address-button-wrapper"]}`}>
                      {address?.data.count! > 0 && (
                        <button
                          onClick={() => setisAddress(true)}
                          className={`${styles["address-cancel-button"]}`}
                        >
                          İptal
                        </button>
                      )}
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
                <>
                  <div className={`${styles["with-address-container"]}`}>
                    <div className={`${styles["with-address-title"]}`}>
                      <h5 className={`${styles["address-count-title"]}`}>
                        Adreslerim&nbsp;({address?.data.results.length})
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
                      {address?.data.results.map((a, index) => (
                        <div key={index} className={`${styles["address-box"]}`}>
                          <div className={`${styles["address-title"]}`}>
                            {a.title}
                          </div>

                          <div className={`${styles["address"]}`}>
                            {`${a.full_address}, ${a.subregion.name}, ${a.region.name}, ${a.country.name}`}
                          </div>

                          <div className={`${styles["delete-edit-wrapper"]}`}>
                            <button
                              onClick={() => deleteMyAddress(a.id)}
                              className={`${styles["delete-button"]}`}
                            >
                              <i
                                className={`${styles["delete-button-icon"]} bi bi-trash`}
                              ></i>
                              &nbsp;Sil
                            </button>

                            <button
                              onClick={() => {
                                setaddressId(a.id), setHandleEditAddress(true);
                              }}
                              className={`${styles["address-edit-button"]}`}
                            >
                              Adresi Düzenle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                            onSubmit={handleSubmit(editMyAddress)}
                            action="#"
                            className={`${styles["modal-form"]}`}
                          >
                            <label
                              className={`${styles["address-title-label"]}`}
                            >
                              *Adres Başlığı
                            </label>
                            <input
                              {...register("title")}
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
                              {...register("first_name")}
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
                              {...register("last_name")}
                              id={`${styles["address-lastName-input"]}`}
                              type="text"
                              required
                            />

                            <label className={`${styles["address-label"]}`}>
                              *Adres
                            </label>
                            <input
                              {...register("full_address")}
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
                              {...register("country_id", {
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
                              {...register("region_id", {
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
                              *İlçe
                            </label>
                            <select
                              {...register("subregion_id", {
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
                              control={control}
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
                                    onChange={(phone) => onChange(`+${phone}`)}
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
