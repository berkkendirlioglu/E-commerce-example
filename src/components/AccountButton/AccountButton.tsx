import styles from "./accountbutton.module.scss";

export const AccountButton = ({ content }: { content: string }) => {
  return (
    <div className={`${styles["form-btn-wrapper"]}`}>
      <button type="submit" className={`${styles["form-btn"]}`}>{content}</button>
    </div>
  );
};
