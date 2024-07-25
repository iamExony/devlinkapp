"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firestore, storage } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

const PreviewPage = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'profiles'));
        const profilesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const profileImageUrl = await getDownloadURL(ref(storage, `profilePictures/${data.profilePictureURL}`));
            return { ...data, profileImageUrl };
          })
        );
        setProfiles(profilesData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  if (!profiles.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {profiles.map((profile, index) => (
          <div key={index}>
            <div className="flex justify-center mb-6">
              <Image src={profile.profileImageUrl} width={100} height={100} alt="Profile Image" className="rounded-full" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600 mb-6">{profile.email}</p>
            {profile.socialLinks && profile.socialLinks.map((link: any, linkIndex: number) => (
              <button
                key={linkIndex}
                onClick={() => copyToClipboard(link.url)}
                className={`w-full flex justify-between items-center py-2 px-4 mb-2 border rounded-md shadow-sm text-sm font-medium ${link.bgColor}`}
              >
                <i className={`fas ${link.icon} mr-2`}></i>
                {link.name}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Editor
          </button>
          <button
            onClick={() => copyToClipboard(window.location.href)}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
