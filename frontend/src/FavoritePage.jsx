import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import data from "./data/restaurant_data.json";

// 共用的 localStorage 操作
function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}
function getFavorites(user) {
  return JSON.parse(localStorage.getItem(`favorites_${user}`)) || [];
}
function isFavorite(user, id) {
  return getFavorites(user).includes(id);
}
function toggleFavorite(user, id) {
  const current = getFavorites(user);
  const updated = current.includes(id)
    ? current.filter(rid => rid !== id)
    : [...current, id];
  localStorage.setItem(`favorites_${user}`, JSON.stringify(updated));
}

export default function FavoritesPage() {
  const [favoriteList, setFavoriteList] = useState([]);
  const user = getLoggedInUser();

  useEffect(() => {
    if (user) {
      const favIds = getFavorites(user);
      const favRestaurants = data.filter((rest) =>
        favIds.includes(rest.restaurant_id)
      );
      setFavoriteList(favRestaurants);
    }
  }, [user]);

  const handleToggle = (id) => {
    toggleFavorite(user, id);
    const updatedFavIds = getFavorites(user);
    const updatedFavRestaurants = data.filter((rest) =>
      updatedFavIds.includes(rest.restaurant_id)
    );
    setFavoriteList(updatedFavRestaurants);
  };

  if (!user) return <p>請先登入以查看收藏。</p>;

  return (
    <div className="container">
      <h1>❤️我的收藏餐廳❤️</h1>
      {favoriteList.length === 0 ? (
        <p>尚未收藏任何餐廳，趕快去新增!!</p>
      ) : (
        <div className="results">
          {favoriteList.map((rest) => (
            <Link
              to={`/restaurant/${rest.restaurant_id}`}
              key={rest.restaurant_id}
              className="card-link"
            >
              <div className="card">
                <img
                  src={rest.image || "https://via.placeholder.com/400x200?text=無圖片"}
                  alt={rest.name}
                  loading="lazy"
                />
                <div className="card-content">
                  
                  <h2>{rest.name}</h2>
                  <p>{rest.cuisine_type} · {rest.district?.district}</p>
                  <p>地址：{rest.address}</p>
                  <p>評分：⭐ {rest.rating}</p>
                </div>
                <button
                    className="favorite-btn"
                    onClick={(e) => {
                      e.preventDefault(); // 防止觸發 Link
                      handleToggle(rest.restaurant_id);
                    }}
                  >
                    {isFavorite(user, rest.restaurant_id) ? "💖" : "🤍"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
