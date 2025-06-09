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
    priceRange: "",
    cuisineTypes: [],
    image: "",
    district: "", // 預設值
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
      // 驗證餐廳欄位
      if (form.userType === "owner") {
        if (!form.storeName || !form.address || !form.phone) {
          alert("❌ 餐廳資訊不完整！");
          return;
        }
      }

      // 註冊帳號
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.userType === "owner" ? "owner" : "user",
          ...(form.userType === "owner" && {
            restaurant: {
              name: form.storeName,
              address: form.address,
              phone: form.phone,
              price_range: form.priceRange,
              cuisine_type: form.cuisineTypes.join("、"),
              cover: form.image,
              county: "",
              district: form.district,
              station_name: ""
            }
          })
        }),
      });

      const result = await res.json();
      if (!res.ok) return alert(`❌ 註冊失敗：${result.error}`);

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
                <option value="$">$0 - $200</option>
                <option value="$$">$201 - $400</option>
                <option value="$$$">$401 - $600</option>
                <option value="$$$$">$601 - $800</option>
                <option value="$$$$$">$801 以上</option>
              </select>

              <label>地區：</label>
              <select name="district" value={form.district} onChange={handleChange}>
                <option value="中正區">中正區</option>
                <option value="大同區">大同區</option>
                <option value="中山區">中山區</option>
                <option value="松山區">松山區</option>
                <option value="大安區">大安區</option>
                <option value="萬華區">萬華區</option>
                <option value="信義區">信義區</option>
                <option value="士林區">士林區</option>
                <option value="北投區">北投區</option>
                <option value="內湖區">內湖區</option>
                <option value="南港區">南港區</option>
                <option value="文山區">文山區</option>
                <option value="板橋區">板橋區</option>
                <option value="新莊區">新莊區</option>
                <option value="中和區">中和區</option>
                <option value="永和區">永和區</option>
                <option value="三重區">三重區</option>
                <option value="蘆洲區">蘆洲區</option>
                <option value="土城區">土城區</option>
                <option value="樹林區">樹林區</option>
                <option value="鶯歌區">鶯歌區</option>
                <option value="三峽區">三峽區</option>
                <option value="淡水區">淡水區</option>
                <option value="八里區">八里區</option>
                <option value="林口區">林口區</option>
                <option value="五股區">五股區</option>
                <option value="泰山區">泰山區</option>
                <option value="新店區">新店區</option>
                <option value="深坑區">深坑區</option>
                <option value="石碇區">石碇區</option>
                <option value="坪林區">坪林區</option>
                <option value="烏來區">烏來區</option>
                <option value="三芝區">三芝區</option>
                <option value="石門區">石門區</option>
                <option value="金山區">金山區</option>
                <option value="萬里區">萬里區</option>
                <option value="瑞芳區">瑞芳區</option>
                <option value="貢寮區">貢寮區</option>
                <option value="平溪區">平溪區</option>
                <option value="雙溪區">雙溪區</option>
                <option value="汐止區">汐止區</option>
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