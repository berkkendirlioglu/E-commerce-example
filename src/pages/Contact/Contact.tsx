import styles from './contact.module.scss';
import {ContactForm} from '../index.ts';

const Contact = () => {
  return (
    <div className={`${styles["contact"]}`}>
        <div className={`${styles["contact-container"]}`}>
            <div className={`${styles["form-container"]}`}>
                <div className={`${styles["form-header"]}`}>
                    <h1 className={`${styles["header-text"]}`}>Bize Ulaşın</h1>
                </div>
                
                <ContactForm/>

                <div className={`${styles["information"]}`}>
                    <p className={`${styles["f-text"]}`}>
                        *Aynı gün kargo hafta içi 16:00, Cumartesi ise 11:00' a kadar verilen siparişler icin geçerlidir.
                        Siparişler kargoya verilince e-posta ve sms ile bilgilendirme yapılır.
                    </p>
                    <br />
                    <p className={`${styles["s-text"]}`}>
                        Telefon ile <span>0850 303 29 89</span> numarasını arayarak da bizlere sesli mesaj bırakabilirsiniz. Sesli mesajlarınıza hafta içi saat
                        <span> 09:00-17:00 </span>arasında dönüş sağlanmaktadır.
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact
