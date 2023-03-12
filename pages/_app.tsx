import Loading from '@/components/Loading';
import { auth, db } from '@/config/firebase';
import '@/styles/globals.css'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './login';

export default function App({ Component, pageProps }: AppProps) {
  const [loginUser, loading, _error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loginUser?.email as string),
          {
            email: loginUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loginUser?.photoURL,
          },
          {
            merge: true // tương tự upsert laravel, có thì cập nhật. Chỉ 1 bản ghi
          }
        )
      } catch (error) {
        console.log('ERROR DB USER INFO DB', error);
      }
    }
    if (loginUser) {
      setUserInDb()
    }
  }, [loginUser])

  if (loading) return <Loading />

  if (!loginUser) {
    return <Login />
  }
  return <Component {...pageProps} />
}
