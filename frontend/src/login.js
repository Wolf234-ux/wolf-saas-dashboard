import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        onLogin(data.access_token);
      } else {
        alert("Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  return (
    <div className="login-container">
      <h2>Wolf AI Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;