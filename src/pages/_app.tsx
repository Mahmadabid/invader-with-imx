import Layout from '@/components/Layout'
import Login from '@/components/Login';
import '@/styles/globals.css'
import { UserContext } from '@/utils/Context';
import { passportInstance } from '@/utils/immutable';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const [User, setUser] = useState(false);
  const router = useRouter();

  const checkUserLoggedIn = async () => {
    try {
      const userProfile = await passportInstance.getUserInfo();
      Boolean(userProfile === undefined) ? null : setUser(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={[User, setUser]}>
      <Layout>
        {!User && router.pathname !== '/auth/callback' ?
          <Login />
          :
          <Component {...pageProps} />}
      </Layout>
    </UserContext.Provider>

  )
}
