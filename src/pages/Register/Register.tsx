import { NavLink } from 'react-router-dom';
import { LoginRegisterWrapper } from '../Login/Login';
import styles from './register.module.scss';
import {AccountButton} from '../index.ts'

const Register = () => {
  return (
    <div className={`${styles["register"]}`}>
        <div className={`${styles["register-container"]}`}>

            <LoginRegisterWrapper>

              <div className={`${styles["register-header"]}`}>
                  <NavLink className={`${styles["login-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/login"}>Giriş Yap</NavLink>
                  <NavLink className={`${styles["register-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/register"}>Üye Ol</NavLink>
              </div>

              <div className={`${styles["register-form-wrapper"]}`}>

                  <form className={`${styles["register-form"]}`} action="#">

                      <label className={`${styles["first-name"]}`} htmlFor="#">*Ad</label>
                      <input id={`${styles["first-name"]}`} type="text" />
                      <label className={`${styles["last-name"]}`} htmlFor="#">*Soyad</label>
                      <input id={`${styles["last-name"]}`} type="text" />
                      <label className={`${styles["email"]}`} htmlFor="#">*E-Posta</label>
                      <input id={`${styles["email"]}`} type="email" />
                      <label className={`${styles["password"]}`} htmlFor="#">*Şifre</label>
                      <input id={`${styles["password"]}`} type="password" />

                  </form>

                  <AccountButton content='ÜYE OL'/>

                  <div className={`${styles["login-link-wrapper"]}`}>
                    <span className={`${styles["login-text"]}`}>
                      Zaten hesabınız var mı? <NavLink className={`${styles["login-link"]}`} to={"/account/login"}>Giriş Yap</NavLink>
                    </span>
                  </div>

              </div>
              
            </LoginRegisterWrapper>

        </div>
    </div>
  )
}

export default Register
