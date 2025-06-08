import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import nullImage from "./data/null_image.png";

function getPriceRangeString(priceRange) {
  if (!priceRange) return "價格資訊不詳";
  if (priceRange === "$") return "低價";
  if (priceRange === "$$") return "中價";
  if (priceRange === "$$$") return "高價";
  return "價格資訊不詳";
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        const json = await res.json();
        setRestaurant(json);
      } catch (err) {
        console.error("載入餐廳資料失敗", err);
      }
    }

    async function fetchPhotos() {
      try {
        const res = await fetch(`/api/images/${id}`);
        const json = await res.json();
        const urls = json.map((img) => img.image_url);
        setPhotos(urls);
      } catch (err) {
        console.error("載入圖片失敗", err);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        const json = await res.json();
        setReviews(json);
      } catch (err) {
        console.error("載入評論失敗", err);
      }
    }

    fetchRestaurant();
    fetchPhotos();
    fetchReviews();
  }, [id]);

  if (!restaurant) return <p>載入中...</p>;

  return (
    <div className="container">
      <br />
      <h1>{restaurant.name}</h1>

      {photos.length > 0 && (
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          navigation
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2.5,
            slideShadows: true,
          }}
          className="photo-carousel"
          style={{ paddingBottom: "3rem" }}
        >
          {photos.map((photoUrl, idx) => (
            <SwiperSlide
              key={idx}
              style={{
                width: "600px",
                height: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={photoUrl}
                alt={`餐廳圖片 ${idx + 1}`}
                onError={(e) => {
                  e.target.src = nullImage;
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="detail-info">
        <h3><strong>類型：</strong>{restaurant.cuisine_type || "無資料"}</h3>
        <h3><strong>地區：</strong>{restaurant.district}</h3>
        <h3><strong>地址：</strong>{restaurant.address}</h3>
        <h3><strong>電話：</strong>{restaurant.phone}</h3>
        <h3><strong>價格範圍：</strong>{getPriceRangeString(restaurant.price_range)}</h3>
        <h3><strong>評分：</strong>⭐ {restaurant.rating}</h3>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h2>評論區</h2>
      {reviews.length > 0 ? (
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
          {reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>{review.user_id}</strong>（{review.review_date}）</p>
              <p>評分：⭐ {review.rating}</p>
              <p>
                {review.comment.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>尚無評論</p>
      )}
    </div>
  );
}