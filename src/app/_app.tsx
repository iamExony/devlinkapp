"use client";

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';
import { useEffect } from 'react';
import { ComponentType, FC } from 'react';

// Define the type for the props of the wrapped component
type WithAuthProps = {
  // Add any additional props here if needed
};

// Define the higher-order component with a generic type for the wrapped component's props
const withAuth = <P extends WithAuthProps>(Component: ComponentType<P>): FC<P> => {
  const AuthenticatedComponent: FC<P> = (props) => {
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

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default withAuth;
