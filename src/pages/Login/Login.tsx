import { NavLink } from 'react-router-dom';
import styles from './login.module.scss';
import styled from 'styled-components';
import {AccountButton} from '../index.ts'
import { FormEvent, useState } from 'react';
import { LoginPayload } from '../../types/AccountType.ts';
import { api_key } from '../Register/Register.tsx';
import { login } from '../../services/collection/auth.ts';
import { removeTokens } from '../../services/storage.ts';

export const LoginRegisterWrapper = styled.div`
    width: 40%;

    @media (max-width:1200px){
        width: 50%;
    }
    @media(max-width:768px){
        width: 60%;
    };
    @media(max-width:576px){
        width: 95%;
    }
`;

const Login = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const handleLogin = async (e:FormEvent) => {
        e.preventDefault();
        const formEl = e.target as HTMLFormElement;
        const formData = new FormData(formEl);
        const data = Object.fromEntries(formData) as unknown as {username:string, password:string};
        const modifyData:LoginPayload = {...data, api_key:api_key}

        const response = await login(modifyData);

        if(response.access_token){
            setIsLogin(true)
            setTimeout(() => {
                setIsLogin(false);
            }, 3000);
            setTimeout(() => {
                window.location.href = "/";
            }, 3500);
        }else{
            alert("Şifre ya da e-mail yanlış");
            removeTokens();
        }
    }

  return (
    <div className={`${styles["login-page"]}`}>
        <div className={`${styles["login-successfully-container"]} ${isLogin ? styles["show-successfully-container"]:""}`}>
            <span className={`${styles["login-successfully-text"]}`}>Giriş Başarılı!</span>
        </div>
        <div className={`${styles["login-container"]}`}>

            <LoginRegisterWrapper>

            <div className={`${styles["login-header"]}`}>
                <NavLink className={`${styles["login-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/login"}>Giriş Yap</NavLink>
                <NavLink className={`${styles["register-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/register"}>Üye Ol</NavLink>
            </div>

                <div className={`${styles["login-form-wrapper"]}`}>

                    <form className={`${styles["login-form"]}`} onSubmit={handleLogin}>
                        <label className={`${styles["email-title"]}`} htmlFor="email">*E-Posta</label>
                        <input name='username' id={`${styles["email"]}`} type="text" />
                        <label className={`${styles["pass-title"]}`} htmlFor="password">*Şifre</label>
                        <input name='password' id={`${styles["password"]}`} type="password" />
                        <AccountButton content='GİRİŞ YAP'/>
                    </form>

                    <div className={`${styles["forget-password"]}`}>
                        <NavLink className={`${styles["forget-pass-text"]}`} to={"/account/forgot-password"}>Şifremi Unuttum?</NavLink>
                    </div>

                    
                    
                </div>

            </LoginRegisterWrapper>

        </div>
    </div>
  )
}

export default Login;
