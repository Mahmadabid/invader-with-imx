import { useEffect, useState } from 'react';
import { UserProps, passportInstance } from '@/utils/immutable';

export const getKeyId = async () => {
  try {
    const response = await fetch('https://auth.immutable.com/.well-known/jwks.json');
    const jwks = await response.json();

    const keyId = jwks.keys[0].kid;

    return keyId;
  } catch (error) {
    console.error('Error fetching JWKs:', error);
    throw new Error('Failed to fetch key ID');
  }
};


type JWTProps = {
  accessToken: string;
  idToken: string;
};

export const useJWT = (userProvider: UserProps): JWTProps => {
  const [jwt, setJwt] = useState<JWTProps>({ accessToken: '', idToken: '' });

  useEffect(() => {
    async function getJWT() {
      if (userProvider === 'passport') {
        const idToken = await passportInstance.getIdToken();
        const accessToken = await passportInstance.getAccessToken();

        setJwt({
          accessToken: accessToken || '',
          idToken: idToken || '',
        });
      }

      if (userProvider === 'metamask') {
        setJwt({
          accessToken: process.env.NEXT_PUBLIC_JWT || '',
          idToken: '',
        })
      }

    }

    getJWT();
  }, []);

  return jwt;
};
