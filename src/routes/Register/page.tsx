import { NavLink } from "react-router-dom";
import { LoginRegisterWrapper } from "../Login/page.tsx";
import styles from "./register.module.scss";
import { AccountButton } from "../index.ts";
import { FormEvent, useState } from "react";
import { RegisterPayload } from "../../types/account-types.ts";
import { register } from "../../services/collection/auth.ts";

const api_key = import.meta.env.VITE_API_KEY;

export const Register = () => {
  const [registerSuccess, setregisterSuccess] = useState<boolean>(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData) as unknown as RegisterPayload;
    const modifyData: RegisterPayload = {
      ...data,
      password2: data.password,
      api_key: api_key,
    };

    const response = await register(modifyData);

    if (response.status === "success") {
      setregisterSuccess(true);

      setTimeout(() => {
        setregisterSuccess(false);
      }, 3000);

      setTimeout(() => {
        window.location.href = "/account/login";
      }, 3500);
    }
  };

  return (
    <div className={`${styles["register"]}`}>
      <div className={`${styles["register-successfully-container"]} ${
          registerSuccess ? styles["show-successfully-container"] : ""
        }`}
      >
        <span className={`${styles["register-successfully-text"]}`}>
          Kayıt Başarılı!
        </span>
      </div>

      <div className={`${styles["register-container"]}`}>
        <LoginRegisterWrapper>
          <div className={`${styles["register-header"]}`}>
            <NavLink
              className={`${styles["login-page-btn"]}`}
              style={({ isActive }) =>
                isActive ? { color: "rgba(33, 38, 171, 1)" } : undefined
              }
              to={"/account/login"}
            >
              Giriş Yap
            </NavLink>
            <NavLink
              className={`${styles["register-page-btn"]}`}
              style={({ isActive }) =>
                isActive ? { color: "rgba(33, 38, 171, 1)" } : undefined
              }
              to={"/account/register"}
            >
              Üye Ol
            </NavLink>
          </div>

          <div className={`${styles["register-form-wrapper"]}`}>
            <form
              className={`${styles["register-form"]}`}
              onSubmit={handleRegister}
            >
              <label className={`${styles["first-name"]}`} htmlFor="#">
                *Ad
              </label>
              <input
                name="first_name"
                id={`${styles["first-name"]}`}
                type="text"
              />
              <label className={`${styles["last-name"]}`} htmlFor="#">
                *Soyad
              </label>
              <input
                name="last_name"
                id={`${styles["last-name"]}`}
                type="text"
              />
              <label className={`${styles["email"]}`} htmlFor="#">
                *E-Posta
              </label>
              <input name="email" id={`${styles["email"]}`} type="email" />
              <label className={`${styles["password"]}`} htmlFor="#">
                *Şifre
              </label>
              <input
                name="password"
                id={`${styles["password"]}`}
                type="password"
              />
              <AccountButton content="ÜYE OL" />
            </form>

            <div className={`${styles["login-link-wrapper"]}`}>
              <span className={`${styles["login-text"]}`}>
                Zaten hesabınız var mı?{" "}
                <NavLink
                  className={`${styles["login-link"]}`}
                  to={"/account/login"}
                >
                  Giriş Yap
                </NavLink>
              </span>
            </div>
          </div>
        </LoginRegisterWrapper>
      </div>
    </div>
  );
};
