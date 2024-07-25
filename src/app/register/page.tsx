'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import Image from 'next/image';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';

    if (!email) {
      emailError = "Can't be empty";
    }

    if (!password) {
      passwordError = 'Password is required';
    } else if (password.length < 8) {
      passwordError = 'Password must contain at least 8 characters';
    }

    if (password !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }

    setErrors({ email: emailError, password: passwordError, confirmPassword: confirmPasswordError });

    if (!emailError && !passwordError && !confirmPasswordError) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Account created successfully!');
        router.push('/login'); // Redirect to the login page
      } catch (error) {
        setErrors({ email: '', password: '', confirmPassword: 'Failed to create account. Please try again.' });
      }
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image width={100} height={100} src="/logo.png" alt="Devlinks Logo" className="h-12" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
        <p className="text-gray-600 mb-6">Add your details below to create a new account</p>
        {successMessage && (
          <div className="mb-4 text-green-500 text-center">{successMessage}</div>
        )}
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Create Password:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create your password"
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-20 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.confirmPassword && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Password must contain at least 8 characters</p>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountPage;
