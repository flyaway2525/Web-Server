import React, { useState, useEffect } from 'react';
import UsernameDisplay from '../components/UsernameDisplay';
import Link from 'next/link';

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
        <Link href="/memberOnly">Go to Member-Only Page</Link>
      </div>
    </div>
  );
};

export default News;
