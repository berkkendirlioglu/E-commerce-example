import { NavLink } from "react-router-dom";
import styles from "./Comments.module.scss";
import { CommentsType, RatingStars } from "../../routes/index.ts";
import { useEffect, useState } from "react";
import {
  AddNewComment,
  ProductsComments,
} from "../../services/collection/auth.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { SubmitCommentType } from "../../types/CommentsType.ts";
import { Rating } from "react-simple-star-rating";

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

export const Comments = ({ slug }: { slug: string }) => {
  const [productComments, setProductComments] = useState<CommentsType>();
  const { register, handleSubmit } = useForm<SubmitCommentType>();
  const [rating, setRating] = useState<number>(0);
  const [notTaken, setNotTaken] = useState<boolean>();

  useEffect(() => {
    const getProductComments = async () => {
      const response = await ProductsComments(
        `/products/${slug}/comments?limit=10&offset=0`
      );

      setProductComments(response);
    };

    getProductComments();
  }, []);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const addNewComment: SubmitHandler<SubmitCommentType> = async (data) => {
    const renewedData: SubmitCommentType = {
      ...data,
      stars: rating.toString(),
    };

    const response = await AddNewComment(renewedData, slug);

    if (response.status === "error") {
      setNotTaken(true);
      setTimeout(() => {
        setNotTaken(false);
      }, 2000);
    }
  };
  return (
    <>
      <div
        className={`${styles["alert-container"]} ${
          notTaken ? styles["show-alert-container"] : ""
        }`}
      >
        <span className={`${styles["alert-text"]}`}>
          Ürüne yorum yapabilmek için bu ürünü satın almalısınız!
        </span>
      </div>

      <div className={`${styles["comments-form"]}`}>
        <div className={`${styles["comment-form-title"]}`}>
          <h2 className={`${styles["comment-box-title"]}`}>
            Üründen Memnun Musun?
          </h2>
          <span className={`${styles["comment-text"]}`}>Bizimle Paylaş</span>
        </div>
        <form
          className={`${styles["comment-form"]}`}
          onSubmit={handleSubmit(addNewComment)}
        >
          <div className={`${styles["stars-wrapper"]}`}>
            <Rating onClick={handleRating} />
          </div>

          <input
            placeholder="Başlık..."
            className={`${styles["comment-title"]}`}
            type="text"
            {...register("title")}
          />
          <textarea
            placeholder="Yorumunuz..."
            className={`${styles["comment-box"]}`}
            rows={10}
            cols={50}
            {...register("comment")}
          />
          <button className={`${styles["submit-comment-button"]}`}>
            Yorum Yap
          </button>
        </form>
      </div>

      {productComments?.data.results.map((comment, index) => (
        <div key={index} className={`${styles["comment"]}`}>
          <div className={`${styles["comment-header"]}`}>
            <div className={`${styles["comment-owner"]}`}>
              <RatingStars rating={Number(comment.stars)} />
              <span className={`${styles["owner"]}`}>
                {comment.first_name + " " + comment.last_name}
              </span>
              <div className={`${styles["badge"]}`}>
                <span className={`${styles["badge-text"]}`}>
                  DOĞRULANMIŞ MÜŞTERİ
                </span>
              </div>
            </div>

            <div className={`${styles["comment-date"]}`}>
              <span className={`${styles["date"]}`}>
                {new Date(comment.created_at).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className={`${styles["comment-body"]}`}>
            <div className={`${styles["comment-title"]}`}>
              <span className={`${styles["title-text"]}`}>{comment.title}</span>
            </div>

            <div className={`${styles["comment-desc"]}`}>
              <span className={`${styles["desc-text"]}`}>
                {comment.comment}
              </span>
            </div>

            <div className={`${styles["product-about"]}`}>
              <span className={`${styles["product-text"]}`}>
                HAKKINDA{" "}
                <span>
                  {slug.replace("-", " ").toUpperCase() + " " + comment.aroma}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}

      {productComments?.data.next && (
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
      )}
    </>
  );
};
