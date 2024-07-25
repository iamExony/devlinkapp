"use client";

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';
import { useEffect } from 'react';

const withAuth = (Component) => {
  return (props) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
