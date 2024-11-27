import styles from './ratingstars.module.scss';

const RatingStars = ({rating}: {rating:number}) => {
  const rate = [];

  for(let i =0; i < rating; i++){
    rate.push(
        <i key={i} className={`${styles["stars"]} bi bi-star-fill`}></i>
    )
  }

  return <div className={`${styles["rating"]}`}>{rate}</div>
}

export default RatingStars
