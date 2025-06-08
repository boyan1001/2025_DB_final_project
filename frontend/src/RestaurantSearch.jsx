import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import nullImage from './data/null_image.png';

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

function getVisiblePageNumbers(currentPage, totalPages, windowSize = 2) {
  const pages = [];

  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < totalPages - 1) pages.push("...");

  return [1, ...pages, totalPages];
}

export default function RestaurantSearch() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [district, setDistrict] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const user = getLoggedInUser();

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (cuisine) params.append("cuisine", cuisine);
      if (district) params.append("district", district);

      try {
        const res = await fetch(`/api/restaurants?${params.toString()}`);
        const json = await res.json();
        console.log("取得的資料", json);
        setRestaurants(json);
        setCurrentPage(1);
      } catch (err) {
        console.error("載入餐廳資料失敗", err);
      }
    }

    fetchData();
  }, [query, cuisine, district]);

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = restaurants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h1>🍽 美食搜尋系統</h1>

      <div className="filters" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="輸入餐廳名稱"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          <option value="">所有料理</option>
          <option value="Chinese 中式">中式</option>
          <option value="Japanese 日式">日式</option>
          <option value="Italian 義式">義式</option>
          <option value="Korean 韓式">韓式</option>
          <option value="Brunch 早午餐">早午餐</option>
          <option value="Dessert 甜點">甜點</option>
          <option value="Others 其他">其他</option>
        </select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">所有地區</option>
          <option value="三重區">三重區</option>
          <option value="中和區">中和區</option>
          <option value="中山區">中山區</option>
          <option value="中正區">中正區</option>
          <option value="內湖區">內湖區</option>
          <option value="土城區">土城區</option>
          <option value="大同區">大同區</option>
          <option value="大安區">大安區</option>
          <option value="士林區">士林區</option>
          <option value="文山區">文山區</option>
          <option value="新店區">新店區</option>
          <option value="新莊區">新莊區</option>
          <option value="板橋區">板橋區</option>
          <option value="松山區">松山區</option>
          <option value="汐止區">汐止區</option>
          <option value="泰山區">泰山區</option>
          <option value="淡水區">淡水區</option>
          <option value="永和區">永和區</option>
          <option value="南港區">南港區</option>
          <option value="萬華區">萬華區</option>
          <option value="蘆洲區">蘆洲區</option>
          <option value="樹林區">樹林區</option>
          <option value="北投區">北投區</option>
        </select>
      </div>

      <div className="results">
        {paginated.map((rest) => (
          <Link
            to={`/restaurant/${rest.restaurant_id}`}
            key={rest.restaurant_id}
            className="card-link"
          >
            <div className="card">
              <img
                src={rest.cover || nullImage}
                alt={rest.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = nullImage;
                }}
              />
              <div className="card-content">
                <h2>{rest.name}</h2>
                <p>{Array.isArray(rest.cuisine_type) ? rest.cuisine_type.join("、") : rest.cuisine_type} · {rest.district || "未知地區"}</p>
                <p>地址：{rest.address}</p>
                <p>評分：⭐ {rest.rating}</p>
              </div>
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (!user) {
                    alert("請先登入才能收藏餐廳！");
                    return;
                  }
                  toggleFavorite(user, rest.restaurant_id);
                  setRestaurants([...restaurants]);
                }}
              >
                {user && isFavorite(user, rest.restaurant_id) ? "💖" : "🤍"}
              </button>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>« First</button>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt; Prev</button>
          {getVisiblePageNumbers(currentPage, totalPages).map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} style={{ margin: "0 6px" }}>...</span>
            ) : (
              <button key={p} onClick={() => setCurrentPage(p)} className={currentPage === p ? "active-page" : ""}>{p}</button>
            )
          )}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &gt;</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last »</button>
        </div>
      )}

      <div className="pagination-controls">
        <label>
          每頁顯示：
          <select value={itemsPerPage} onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}>
            <option value={6}>6 筆</option>
            <option value={12}>12 筆</option>
            <option value={24}>24 筆</option>
            <option value={restaurants.length}>全部</option>
          </select>
        </label>
      </div>

      <div className="pagination-controls">
        <label>
          跳至第
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpPageInput}
            onChange={(e) => setJumpPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt(jumpPageInput, 10);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                } else {
                  alert("請輸入有效的頁數！");
                }
              }
            }}
          />
          頁
        </label>
        <button onClick={() => {
          const page = parseInt(jumpPageInput, 10);
          if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          } else {
            alert("請輸入有效的頁數！");
          }
        }}>Go</button>
      </div>
    </div>
  );
}
