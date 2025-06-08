import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ 登入成功！");
        setUser(result.user.username); // 將登入使用者設為全域
        localStorage.setItem("loggedInUser", result.user.username); // 可視需要儲存
        navigate("/");
      } else {
        alert(`❌ 登入失敗：${result.error}`);
      }
    } catch (err) {
      alert("❌ 發生錯誤：" + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>登入帳號</h2>
        <form onSubmit={handleLogin}>
          <input name="username" type="text" placeholder="帳號" required />
          <input name="password" type="password" placeholder="密碼" required />
          <button type="submit">登入</button>
        </form>
        <div className="switch-link">
          還沒有帳號？<br /><br />
          <button onClick={() => navigate("/register")}>前往註冊</button>
        </div>
      </div>
    </div>
  );
}