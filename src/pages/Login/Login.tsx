import { NavLink } from 'react-router-dom';
import styles from './login.module.scss';
import styled from 'styled-components';
import {AccountButton} from '../index.ts'
import User from '../../dummyData/Users.json';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

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

interface LoginDataType {
    email:string,
    password:string,
}


const Login = () => {
    const [loginData, setloginData] = useState<LoginDataType | undefined>();
    const isUser = User.results.some((db) => {
        return db.email === loginData?.email && db.password === loginData.password;
    })

    useEffect(() => {
        if(isUser){
            localStorage.setItem("session_id","4b4b6fce-9998-4ac9-b1bc-78064f5a7432");
            window.location.href = "/";
        }
    }, [isUser]);

    const {register, handleSubmit} = useForm();

    const onSubmit = (d:any) => {
        setloginData(d);
    }

  return (
    <div className={`${styles["login-page"]}`}>
        <div className={`${styles["login-container"]}`}>

            <LoginRegisterWrapper>

            <div className={`${styles["login-header"]}`}>
                <NavLink className={`${styles["login-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/login"}>Giriş Yap</NavLink>
                <NavLink className={`${styles["register-page-btn"]}`} style={({isActive}) => isActive ? {color:"rgba(33, 38, 171, 1)"}:undefined} to={"/account/register"}>Üye Ol</NavLink>
            </div>

                <div className={`${styles["login-form-wrapper"]}`}>

                    <form className={`${styles["login-form"]}`} onSubmit={handleSubmit(onSubmit)}>
                        <label className={`${styles["email-title"]}`} htmlFor="email">*E-Posta</label>
                        <input id={`${styles["email"]}`} {...register("email")} type="text" />
                        <label className={`${styles["pass-title"]}`} htmlFor="password">*Şifre</label>
                        <input id={`${styles["password"]}`} {...register("password")} type="password" />
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
