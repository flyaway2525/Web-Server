import React, { useState, useEffect } from 'react';
import UsernameDisplay from '../components/UsernameDisplay';
import { GetServerSideProps } from 'next';
import { authCheck } from '../utils/authCheck';
import { UserTokenProps } from '@/utils/userTokenProps';

export const getServerSideProps: GetServerSideProps = async (context) => {
    return await authCheck(context);
};

type MemberOnlyTokenProps = {userinfo: UserTokenProps;};
const MemberOnly: React.FC<MemberOnlyTokenProps> = ({userinfo}) => {
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
          <h1>Welcome, {userinfo.sub}!</h1>
          <p>Your ID is: {userinfo.userId}</p>
          <p>Your name is: {userinfo.userName}</p>
          <p>Your exp is: {userinfo.exp}</p>
          <p>Your iat is: {userinfo.iat}</p>
          <p>Your role is: {userinfo.userRole}</p>
        </header>
        {/* 他のニュースコンテンツをこちらに追加 */}
        <div>
          <h1>News Contents</h1>
          {/* ニュースのリストや詳細など */}
        </div>
      </div>
    );
};

export default MemberOnly;
