import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    userType: "user",
    storeName: "",
    address: "",
    phone: "",
    priceRange: "1",
    cuisineTypes: [],
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const updated = checked
          ? [...prev.cuisineTypes, value]
          : prev.cuisineTypes.filter((item) => item !== value);
        return { ...prev, cuisineTypes: updated };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 註冊帳號
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.userType === "owner" ? "owner" : "user",
        }),
      });

      const result = await res.json();
      if (!res.ok) return alert(`❌ 註冊失敗：${result.error}`);

      // 如果是店家，再新增餐廳
      if (form.userType === "owner") {
        const restaurantPayload = {
          name: form.storeName,
          address: form.address,
          phone: form.phone,
          price_range: parseInt(form.priceRange, 10),
          cuisine_type: form.cuisineTypes.join(", "), // 假設後端是 VARCHAR 存字串
          cover: form.image,
        };

        const r2 = await fetch("/api/restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restaurantPayload),
        });

        const result2 = await r2.json();
        if (!r2.ok) return alert(`❌ 餐廳建立失敗：${result2.error}`);
      }

      alert("✅ 註冊成功！");
      navigate("/login");
    } catch (err) {
      alert("❌ 發生錯誤：" + err.message);
    }
  };

  const cuisineOptions = [
    "Chinese 中式", "Japanese 日式", "Italian 義式", "Korean 韓式", "Brunch 早午餐", "Dessert 甜點", "Others 其他"
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>註冊帳號</h2>
        <form onSubmit={handleRegister}>
          <select name="userType" value={form.userType} onChange={handleChange}>
            <option value="user">一般使用者</option>
            <option value="owner">店家</option>
          </select>

          <input
            name="username"
            type="text"
            placeholder="帳號"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="密碼"
            value={form.password}
            onChange={handleChange}
            required
          />

          {form.userType === "owner" && (
            <>
              <input
                name="storeName"
                type="text"
                placeholder="餐廳名稱"
                value={form.storeName}
                onChange={handleChange}
                required
              />
              <input
                name="address"
                type="text"
                placeholder="地址"
                value={form.address}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="text"
                placeholder="電話"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <label>價格範圍：</label>
              <select name="priceRange" value={form.priceRange} onChange={handleChange}>
                <option value="1">1–200$</option>
                <option value="2">201–400$</option>
                <option value="3">401–600$</option>
                <option value="4">601–800$</option>
                <option value="5">801$ 以上</option>
              </select>

              <label>餐廳類型（可複選）：</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {cuisineOptions.map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      name="cuisineTypes"
                      value={type}
                      checked={form.cuisineTypes.includes(type)}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>

              <input
                name="image"
                type="text"
                placeholder="圖片 URL"
                value={form.image}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit">註冊</button>
        </form>

        <div className="switch-link">
          已經有帳號？<br /><br />
          <button onClick={() => navigate("/login")}>回登入頁</button>
        </div>
      </div>
    </div>
  );
}
