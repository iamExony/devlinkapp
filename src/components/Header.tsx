"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  showLinks: boolean;
  setShowLinks: (show: boolean) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showLinks, setShowLinks, showProfile, setShowProfile }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.svg" width={100} height={100} alt="Devlinks Logo" />
      </div>
      <div className="flex gap-4 items-center">
        <button 
          className={`flex items-center gap-1 px-4 py-2 rounded ${showLinks ? 'bg-light-gray text-blue' : 'bg-transparent text-black'}`} 
          onClick={() => { setShowLinks(true); setShowProfile(false); }}>
          <Icon icon="ph:link-bold" />
          <span className="hidden md:block">Links</span>
        </button>
        <button 
          className={`flex items-center gap-1 px-4 py-2 rounded ${showProfile ? 'bg-light-gray text-blue' : 'bg-transparent text-black'}`} 
          onClick={() => { setShowLinks(false); setShowProfile(true); }}>
          <Icon icon="mdi:person-circle-outline" />
          <span className="hidden md:block">Profile Details</span>
        </button>
      </div>
      <div>
        <Link href='/pages' className="flex items-center gap-1 px-4 py-2 text-black rounded">
          <Icon icon="icon-park-outline:preview-open" />
          <span className="hidden md:block">Preview</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
