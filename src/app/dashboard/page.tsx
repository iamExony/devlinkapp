// pages/dashboard.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Links from '@/components/Links';
import ProfileDetails from '@/components/ProfileDetails';
import Image from 'next/image';
import withAuth from '../_app';

const Home: React.FC = () => {
  const [showLinks, setShowLinks] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        showLinks={showLinks}
        setShowLinks={setShowLinks}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Static Phone Skeleton Image */}
        <div className="hidden md:flex items-center justify-center w-1/3 bg-white sticky top-16 h-screen mt-4">
          <Image width={300} height={600} src="/images/phone.svg" alt="Phone Skeleton" className="w-3/4 h-auto" />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {showLinks && <Links />}
          {showProfile && <ProfileDetails />}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Home);
