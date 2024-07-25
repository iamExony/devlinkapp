'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router
import Image from 'next/image';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter(); // Initialize router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let emailError = '';
    let passwordError = '';

    if (!email) {
      emailError = "Can't be empty";
    }

    if (!password) {
      passwordError = 'Please check again';
    }

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log('Logged in successfully:', user);
          const token = await user.getIdToken();
          Cookies.set('authToken', token, { expires: 1 }); // Set token in cookies, expires in 1 day
          router.push('/dashboard'); // Redirect to dashboard
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error logging in:', errorCode, errorMessage);
          if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
            setErrors({ email: '', password: 'Invalid email or password' });
          }
        });
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.svg" width={100} height={100} alt="Devlinks Logo" className="h-12" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <p className="text-gray-600 mb-6">Add your details below to get back into the app</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. alex@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-20 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-red-500 text-xs">{errors.email}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-20 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.password && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-red-500 text-xs">{errors.password}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don &apos;t have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-500">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
