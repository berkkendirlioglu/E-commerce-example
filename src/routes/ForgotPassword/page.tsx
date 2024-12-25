import { NavLink } from 'react-router-dom';
import styles from './forgotpassword.module.scss';
import {AccountButton} from '../index.ts';

export const ForgetPassword = () => {
  return (
    <div className={`${styles["forgot-password"]}`}>
      <div className={`${styles["fw-container"]}`}>
        
          <div className={`${styles["forgot-password-wrapper"]}`}>

              <div className={`${styles["fw-header"]}`}>
                <h4 className={`${styles["fw-title"]}`}>Şifremi Unuttum</h4>
              </div>

              <div className={`${styles["form-wrapper"]}`}>

                  <form className={`${styles["forgot-form"]}`} action="#">

                    <label className={`${styles["fw-email"]}`} htmlFor="email">*E-Posta</label>
                    <input id={`${styles["fw-email"]}`} type="email" />

                  </form>

              </div>

              <AccountButton content='GÖNDER'/>

              <div className={`${styles["login-link-wrapper"]}`}>
                <span className={`${styles["login-text"]}`}>
                      Zaten hesabınız var mı? <NavLink className={`${styles["login-link"]}`} to={"/account/login"}>Giriş Yap</NavLink>
                </span>
              </div>

          </div>

      </div>
    </div>
  )
}

