import styles from "./sss.module.scss";
import { ContactForm, sssStore } from "../index.ts";
import { NavLink } from "react-router-dom";
import { useState } from "react";

interface AccordionProps {
  title:string,
  content:string,
}

const Accordion:React.FC<AccordionProps> = ({title,content}) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  function handleAccordion(){
    setisOpen(!isOpen);
  }
  return (
    <>
      <button onClick={handleAccordion} className={`${styles["accordion"]}`}>
        <p className={`${styles["title"]}`}>{title}</p>
        <i className="bi bi-plus-square"></i>
      </button>
      {isOpen && (
        <div className={`${styles["content"]}`}>
          <p className={`${styles["content-text"]}`}>
            {content}
          </p>
        </div>
      )}
    </>
  );
};

const SSS = () => {
  return (
    <div className={`${styles["sss"]}`}>
      <div className={`${styles["sss-container"]}`}>
        <div className={`${styles["sss-wrapper"]}`}>
          <div className={`${styles["sss-header"]}`}>
            <div className={`${styles["buttons-container"]}`}>
              <NavLink
                to={"/SSS"}
                style={({ isActive }) => ({
                  background: isActive
                    ? "rgba(34, 34, 34, 1)"
                    : "rgba(229, 229, 229, 1)",
                  color: isActive
                    ? "rgba(229, 229, 229, 1)"
                    : "rgba(34, 34, 34, 1)",
                })}
                className={`${styles["button"]}`}
              >
                Genel
              </NavLink>
              <NavLink
                to={"/"}
                style={({ isActive }) => ({
                  background: isActive
                    ? "rgba(34, 34, 34, 1)"
                    : "rgba(229, 229, 229, 1)",
                  color: isActive
                    ? "rgba(229, 229, 229, 1)"
                    : "rgba(34, 34, 34, 1)",
                })}
                className={`${styles["button"]}`}
              >
                Ürünler
              </NavLink>
              <NavLink
                to={"/"}
                style={({ isActive }) => ({
                  background: isActive
                    ? "rgba(34, 34, 34, 1)"
                    : "rgba(229, 229, 229, 1)",
                  color: isActive
                    ? "rgba(229, 229, 229, 1)"
                    : "rgba(34, 34, 34, 1)",
                })}
                className={`${styles["button"]}`}
              >
                Kargo
              </NavLink>
            </div>
            <div className={`${styles["pagination"]}`}>
              <p className={`${styles["pagination-text"]}`}>
                <i
                  className={`${styles["pagination-icon"]} bi bi-credit-card`}
                ></i>
                GENEL
              </p>
            </div>
          </div>
          <div className={`${styles["sss-content"]}`}>
              {sssStore.map((sss, index) => (
                <Accordion key={index} title={sss.title} content={sss.content}/>
              ))}
          </div>
          <div className={`${styles["contact"]}`}>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSS;
