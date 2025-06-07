import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // "user" or "merchant"
  const [storeName, setStoreName] = useState(""); // 店家專用

  const handleRegister = (e) => {
    e.preventDefault();

    const account = {
      username,
      password,
      type: userType,
      ...(userType === "owner" && { storeName }),
    };

    // 儲存到 localStorage
    localStorage.setItem(`user_${username}`, JSON.stringify(account));
    alert("註冊成功！");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>註冊帳號</h2>
        <form onSubmit={handleRegister}>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="user">一般使用者</option>
            <option value="merchant">店家</option>
          </select>

          <input
            type="text"
            placeholder="帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {userType === "merchant" && (
            <input
              type="text"
              placeholder="餐廳名稱"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
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
