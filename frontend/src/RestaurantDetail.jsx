import { useParams } from "react-router-dom";
import data from "./data/restaurant_data.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import nullImage from './data/null_image.png';

function getPriceRangeString(priceRange) {
  if (priceRange == null) return "價格資訊不詳";
  const lower = (priceRange - 1) * 200 + 1;
  const upper = (priceRange) * 200;
  return `$${lower}-${upper}`;
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = data.find((r) => r.restaurant_id === id);
  const photos = restaurant?.photos || [];

  if (!restaurant) return <p>找不到餐廳資料</p>;

  return (
    <div className="container">
      <br/>
      <h1>{restaurant.name}</h1>

      {photos.length > 0 && (
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
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
                  e.target.src = nullImage; // 替換為預設圖片
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
        <h3><strong>類型：</strong>{restaurant.cuisine_type?.join("、")}</h3>
        <h3><strong>地區：</strong>{restaurant.district?.district}</h3>
        <h3><strong>地址：</strong>{restaurant.address}</h3>
        <h3><strong>電話：</strong>{restaurant.phone}</h3>
        <h3><strong>價格範圍：</strong>{getPriceRangeString(restaurant.price_range)}</h3>
        <h3><strong>評分：</strong>⭐ {restaurant.rating}</h3>
      </div>
      <hr style={{ margin: "2rem 0" }} />

      <h2>評論區</h2>
      {restaurant.reviews && restaurant.reviews.length > 0 ? (
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
          {restaurant.reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
              <p><strong>{review.user_name}</strong>（{review.review_date}）</p>
              <p>評分：⭐ {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>尚無評論</p>
      )}
    </div>
  );
}
