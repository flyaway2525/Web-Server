import { useState, FormEvent } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // login時の処理
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();//ページのリロードを防ぐ役割
    let response : any = undefined;
    try {
      const login_api_response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      response = login_api_response;
    }catch(e){
      console.log("login.tsx ERROR");
      console.log(e);
    }

    if (response.ok) {
      const data = await response.json();
      // TokenをCookieとしてセット
      await fetch('/api/setCookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });
      window.location.href = "/news";
    } else {
      console.error('login.tsx Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
