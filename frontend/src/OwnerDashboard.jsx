import { useEffect, useState } from "react";
import "./index.css";

export default function OwnerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [newImage, setNewImage] = useState("");

  const ownerId = localStorage.getItem("loggedInUser");

  useEffect(() => {
    async function fetchRestaurants() {
      const res = await fetch(`/api/restaurants?owner_id=${ownerId}`);
      const data = await res.json();
      setRestaurants(data);
    }

    if (ownerId) fetchRestaurants();
  }, [ownerId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    const res = await fetch(`/api/restaurants/${selected.restaurant_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });

    const result = await res.json();
    alert(result.message || "更新成功");
  };

  const uploadImage = async () => {
    if (!newImage) return;

    const res = await fetch(`/api/restaurants/${selected.restaurant_id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: newImage }),
    });

    const result = await res.json();
    alert(result.message || "圖片新增成功");
    setNewImage("");
  };

  return (
    <div className="owner-section">
      <h2>我的餐廳</h2>
      {restaurants.map((r) => (
        <div key={r.restaurant_id} className="restaurant-item">
          <strong>{r.name}</strong>（{r.district}）
          <button onClick={() => setSelected(r)}>編輯</button>
        </div>
      ))}

      {selected && (
        <div className="edit-form">
          <label>名稱</label>
          <input name="name" value={selected.name} onChange={handleEditChange} />

          <label>地址</label>
          <input name="address" value={selected.address} onChange={handleEditChange} />

          <label>電話</label>
          <input name="phone" value={selected.phone} onChange={handleEditChange} />

          <label>價格範圍</label>
          <select name="price_range" value={selected.price_range} onChange={handleEditChange}>
            <option value="1">$0–200</option>
            <option value="2">$201–400</option>
            <option value="3">$401–600</option>
            <option value="4">$601–800</option>
            <option value="5">$801 以上</option>
          </select>

          <label>菜系</label>
          <input name="cuisine_type" value={selected.cuisine_type} onChange={handleEditChange} />

          <label>評分</label>
          <input name="rating" type="number" value={selected.rating} onChange={handleEditChange} />

          <label>封面圖 URL</label>
          <input name="cover" value={selected.cover} onChange={handleEditChange} />

          <label>縣市</label>
          <input name="county" value={selected.county} onChange={handleEditChange} />

          <label>區域</label>
          <input name="district" value={selected.district} onChange={handleEditChange} />

          <label>捷運站</label>
          <input name="station_name" value={selected.station_name} onChange={handleEditChange} />

          <button onClick={saveChanges}>儲存變更</button>

          <h4 style={{ marginTop: "1.5rem" }}>新增圖片</h4>
          <input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="圖片 URL"
          />
          <button onClick={uploadImage}>新增圖片</button>
        </div>
      )}
    </div>
  );
}