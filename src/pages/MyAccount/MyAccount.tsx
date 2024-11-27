import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Users from "../../dummyData/Users.json";
import { SubmitHandler, useForm } from "react-hook-form";
import { AccountSettingsType } from "../index.ts";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function MyAccount() {
  const [activeSection, setactiveSection] = useState<
    "accountInfo" | "delivery" | "address"
  >("accountInfo");
  const [accountForm, setAccountForm] = useState<AccountSettingsType>();
  const [isAddress, setisAddress] = useState<boolean>();
  const [address, setAddress] = useState<AccountSettingsType[]>([]);

  const { register, handleSubmit } = useForm<AccountSettingsType>();

  const accountSubmit: SubmitHandler<AccountSettingsType> = (data) => {
    setAccountForm(data);
    localStorage.setItem("account",JSON.stringify(accountForm));
  };

  const addressSubmit: SubmitHandler<AccountSettingsType> = (data) => {
    const storedAddress = localStorage.getItem("address");
    const addressArray = storedAddress ? JSON.parse(storedAddress): [];
    const updatedAddressArray = [...addressArray, data];

    localStorage.setItem("address", JSON.stringify(updatedAddressArray));

    setAddress(updatedAddressArray)
    setisAddress(updatedAddressArray.length > 0);
  };

  const handleDeleteAddress = (addressToDelete: string) => {
    const updatedAddressArray = address.filter((address) => address.address !== addressToDelete);

    localStorage.setItem("address", JSON.stringify(updatedAddressArray));

    setAddress(updatedAddressArray);
    setisAddress(updatedAddressArray.length > 0)
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    const addressArray = storedAddress ? JSON.parse(storedAddress) : [];
    setAddress(addressArray);
    setisAddress(addressArray.length > 0);
  }, [window.addEventListener("storage", (event) => {event})]);

  const userData = Users.results[0];

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
                <PhoneInput {...register("phone")} className={`${styles["phone-input"]}`} defaultCountry="TR"  onChange={() => ""}/>

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
            <div className={`${styles["delivery-info-container"]}`}>

              <div className={`${styles["delivery-title-wrapper"]}`}>
                <h5 className={`${styles["delivery-title"]}`}>Siparişler&nbsp;(5)</h5>
              </div>
              
              <div className={`${styles["delivery-content"]}`}>

                <div className={`${styles["delivery-box"]}`}>

                  <div className={`${styles["delivery-first-box"]}`}>
                    
                  </div>

                  <div className={`${styles["detail-button-wrapper"]}`}>
                    <button className={`${styles["delivery-detail-button"]}`}>Detayı Görüntüle</button>
                  </div>

                </div>

              </div>
            </div>
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
                    <PhoneInput {...register("phone")} onChange={() => ""} className={`${styles["address-phone-input"]}`} defaultCountry="TR"/>

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
                    {address.map((a,index) => (
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
