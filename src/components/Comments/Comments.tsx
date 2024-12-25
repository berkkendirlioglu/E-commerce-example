import { NavLink } from "react-router-dom";
import styles from './Comments.module.scss';
import { commentsDummy, RatingStars } from "../../routes/index.ts";

const Pagination = () => {
  const pagination = [];
  for (let i = 1; i <= 9; i++) {
    pagination.push(
      <NavLink
        key={i}
        className={`${styles["numbers"]} ${i === 1 ? styles["active"] : ""}`}
        to={`/${i}`}
      >
        {i}
      </NavLink>
    );
  }
  return pagination;
};

export const Comments = () => {
  return (
    <>
      {commentsDummy.map((comment, index) => (
        <div key={index} className={`${styles["comment"]}`}>
          <div className={`${styles["comment-header"]}`}>
            <div className={`${styles["comment-owner"]}`}>
              <RatingStars rating={5} />
              <span className={`${styles["owner"]}`}>{comment.owner}</span>
              <div className={`${styles["badge"]}`}>
                <span className={`${styles["badge-text"]}`}>
                  DOĞRULANMIŞ MÜŞTERİ
                </span>
              </div>
            </div>

            <div className={`${styles["comment-date"]}`}>
              <span className={`${styles["date"]}`}>{comment.date}</span>
            </div>
          </div>

          <div className={`${styles["comment-body"]}`}>
            <div className={`${styles["comment-title"]}`}>
              <span className={`${styles["title-text"]}`}>{comment.title}</span>
            </div>

            <div className={`${styles["comment-desc"]}`}>
              <span className={`${styles["desc-text"]}`}>{comment.desc}</span>
            </div>

            <div className={`${styles["product-about"]}`}>
              <span className={`${styles["product-text"]}`}>
                HAKKINDA <span>{comment.product}</span>
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className={`${styles["comment-page"]}`}>
        <div className={`${styles["page-numbers"]}`}>
          <NavLink to={"/"} className={`${styles["prev-btn"]}`}>
            <i className="bi bi-chevron-left"></i>
          </NavLink>

          <Pagination />

          <NavLink to={"/"} className={`${styles["next-btn"]}`}>
            <i className="bi bi-chevron-right"></i>
          </NavLink>
        </div>
      </div>
    </>
  );
};

