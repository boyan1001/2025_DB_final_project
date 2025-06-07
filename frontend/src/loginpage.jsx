import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const stored = localStorage.getItem(`user_${username}`);
    if (!stored) {
      alert("找不到此帳號！");
      return;
    }

    const account = JSON.parse(stored);
    if (account.password !== password) {
      alert("密碼錯誤！");
      return;
    }

    localStorage.setItem("loggedInUser", username);
    setUser(username);
    alert("登入成功！");
    navigate("/");
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
          還沒有帳號？<br/><br/>
          <button onClick={() => navigate("/register")}>前往註冊</button>
        </div>
      </div>
    </div>
  );
}
