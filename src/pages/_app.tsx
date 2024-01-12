import Layout from '@/components/Layout'
import Login from '@/components/Login';
import '@/styles/globals.css'
import { UserContext } from '@/utils/Context';
import { passportInstance } from '@/utils/immutable';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface localStorageProps {
  isMetaMask: boolean;
  isPassportWallet: boolean;
}

export default function App({ Component, pageProps }: AppProps) {

  const [User, setUser] = useState<'passport' | 'metamask' | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  const checkUserLoggedIn = async () => {
    try {
      const userProfile = await passportInstance.getUserInfo();
      if (userProfile !== undefined) {
        setUser('passport');
        setUserLoading(false);
        return;
      }

      const localStorageData = localStorage.getItem('ajs_user_traits');

      if (localStorageData) {
        const parsedData: localStorageProps = JSON.parse(localStorageData);
        if (parsedData.isMetaMask && !parsedData.isPassportWallet) {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setUser('metamask');
            setUserLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking user login:', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={[User, setUser]}>
      <Layout>
        {!User && router.pathname !== '/auth/callback' && router.pathname !== '/bridge' && router.pathname !== '/ipx' && router.pathname !== '/leaderboard' ?
          <Login userLoading={userLoading} />
          :
          <Component {...pageProps} />}
      </Layout>
    </UserContext.Provider>

  )
}
