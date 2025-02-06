import styles from "./footer.module.scss";
import { Logo_Beyaz } from "../../routes/index.ts";
import FooterMenu from "../../dummy-data/FooterLinks.ts";
import { NavLink } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import Sign from '../../assets/images/sign.png';

const MenuList = ({ title, content }: { title: string; content: ReactNode }) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    
    const handleResize = () => {
      setWidth(window.innerWidth)
    };

    window.addEventListener('resize', handleResize);

  }, [])
  
  const toggleMenuList = () => {
    setisOpen(!isOpen);
  };

  return (
    <>

      <li onClick={toggleMenuList} className={`${styles["res-title"]}`}>
        <i className={`${styles["res-icon"]} bi bi-plus-lg`}/>
        {title}
      </li>

      {isOpen && (
        <ul className={`${styles["links-container"]}`}>

          {content}

        </ul>
      )}
      {width > 576 && (
        <ul className={`${styles["links-container"]}`}>

          {content}

        </ul>
      )}
    </>
  );
};

export const Footer = () => {
  return (
    <>
      <footer className={`${styles["footer-main"]}`}>
        <div className={`${styles["footer-container"]}`}>
          <img className={`${styles["res-img"]}`} src={Logo_Beyaz} alt="Logo" />
          <div className={`${styles["footer-content"]}`}>

            {FooterMenu.map((menu, index) => (
              <ul key={index} className={`${styles["menu"]}`}>
                {menu.title.includes(".png") ? (
                  <img
                    className={`${styles["menu-img"]}`}
                    src={menu.title}
                    alt="Logo"
                  />
                ) : (
                  <li className={`${styles["menu-header"]}`}>{menu.title}</li>
                )}

                <MenuList title={menu.resTitle} content={menu.links.map((item,index) => (
                    <li key={index} className={`${styles["menu-links"]}`}>
                      <NavLink className={`${styles["link"]}`} to={item.href}>{item.link}</NavLink>
                    </li>
                ))}/>

              </ul>
            ))}

          </div>
          <div className={`${styles["copyright-container"]}`}>
            <span className={`${styles["copyright-text"]}`}>Copyright © - Tüm Hakları Saklıdır.</span>
            <div className={`${styles["sign-container"]}`}>
              <img className={`${styles["copyright-sign"]}`} src={Sign} alt="Sign" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
