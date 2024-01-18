import Layout from '@/components/Layout'
import Login from '@/components/Login';
import '@/styles/globals.css'
import { UserContext } from '@/utils/Context';
import { passportInstance } from '@/utils/immutable';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const [User, setUser] = useState<'passport' | 'metamask' | undefined>(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  const checkUserLoggedIn = async () => {
    const userStorageData = localStorage.getItem('user_provider_pixels_invader');

    const userParsedData = userStorageData?.toString() as 'metamask' | 'passport' | undefined;

    try {
      if (userParsedData) {
        if (userParsedData === 'passport') {
          const userProfile = await passportInstance.getUserInfo();
          if (userProfile !== undefined) {
            setUser('passport');
            setUserLoading(false);
            return;
          }
        }

        if (userParsedData === 'metamask') {
          console.log('hello')
          try {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            console.log(accounts, accounts.length)
            if (accounts.length > 0) {
              setUser('metamask');
              setUserLoading(false);
              return;
            }
          } catch (error) {
            console.log('hasda')
            console.log(error)
          } finally {
            setUserLoading(false)
          }
        }
      }
    } catch (error) {
      console.log('hssi')
      console.error('Error checking user login:', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <>
      <Head>
        <meta property="og:title" content="Pixels Invader" key="ogtitle" />
        <meta property="og:description" content="A web3 version of Space Invaders game built on Nextjs and Immutable Zkevm" key="ogdesc" />
        <meta property="og:image" content="/background2.png" key="ogimage" />
        <meta property="og:url" content="https://pixels-invader.vercel.app/" key="ogurl" />

        <meta name="twitter:title" content="Pixels Invader" key="twittertitle" />
        <meta name="twitter:description" content="A web3 version of Space Invaders game built on Nextjs and Immutable Zkevm" key="twitterdesc" />
        <meta name="twitter:image" content="/background2.png" key="twitterimage" />
        <meta name="twitter:card" content="Pixels Invaders" key="twittercard" />
      </Head>
      <UserContext.Provider value={[User, setUser]}>
        <Layout>
          {!User && router.pathname !== '/auth/callback' && router.pathname !== '/ipx' && router.pathname !== '/leaderboard' ?
            <Login userLoading={userLoading} />
            :
            <Component {...pageProps} />}
        </Layout>
      </UserContext.Provider>
    </>
  )
}
