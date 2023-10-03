import React, { useState, useEffect } from 'react';
import UsernameDisplay from '../components/UsernameDisplay';

const News: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/api/getCookie');
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
      }
    };
    fetchToken();
  }, []);

  return (
    <div>
      <header>
        <UsernameDisplay token={token} />
      </header>
      {/* 他のニュースコンテンツをこちらに追加 */}
      <div>
        <h1>News Contents</h1>
        {/* ニュースのリストや詳細など */}
      </div>
    </div>
  );
};

export default News;
