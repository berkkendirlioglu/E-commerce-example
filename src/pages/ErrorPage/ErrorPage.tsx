import {
  NavLink,
  useRouteError,
} from "react-router-dom";
import styles from "./errorpage.module.scss";

function ErrorPage() {
  const error = useRouteError() as Error;

  return (
    <div className={`${styles["error-page-container"]}`}>
      <h1 className={`${styles["error-title"]}`}>Oops!</h1>
      <h5 className={`${styles["error-explantion"]}`}>Something went wrong!</h5>
      <span className={`${styles[""]}`}>Error Message: </span>
      <code>{error.message}</code>
      <NavLink className={`${styles["return-back-button"]}`} to={"/"}>
        Return Home
      </NavLink>
    </div>
  );
}

export default ErrorPage;
