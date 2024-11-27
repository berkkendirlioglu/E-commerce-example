import styles from "./Contactform.module.scss";

const ContactForm = () => {
  return (
    <div className={`${styles["form"]}`}>
      <div className={`${styles["form-text"]}`}>
        <span className={`${styles["text"]}`}>
          Bize aşağıdaki iletişim formundan ulaşabilirsiniz.
        </span>
      </div>

      <form className={`${styles["contact-form"]}`} action="#">
        <input
          className={`${styles["name"]}`}
          placeholder="İsim *"
          type="text"
        />
        <input
          className={`${styles["lastname"]}`}
          placeholder="Soyad *"
          type="text"
        />
        <input
          className={`${styles["mail"]}`}
          placeholder="E-Posta *"
          type="email"
        />
        <textarea className={`${styles["message"]}`} placeholder="Mesaj *" />

        <div className={`${styles["button-container"]}`}>
          <button className={`${styles["send-button"]}`}>GÖNDER</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
