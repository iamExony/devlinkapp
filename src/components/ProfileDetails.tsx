import { useState } from 'react';
import { Icon } from '@iconify/react';
import { storage, firestore } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null as File | null,
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const validateImage = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const img = new Image();

    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        if (img.width > 1024 || img.height > 1024) {
          reject('Image must be below 1024x1024px');
        } else {
          resolve('');
        }
      };
      img.onerror = () => {
        reject('Invalid image');
      };
      img.src = URL.createObjectURL(file);

      if (!validTypes.includes(file.type)) {
        reject('Use PNG or JPG format');
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the error when user starts typing
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await validateImage(file);
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: file,
        }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          profilePicture: '',
        }));
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          profilePicture: error as string,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    const newErrors = {
      firstName: profile.firstName ? '' : "Can't be empty",
      lastName: profile.lastName ? '' : "Can't be empty",
      email: profile.email ? '' : "Can't be empty",
      profilePicture: errors.profilePicture,
    };

    setErrors(newErrors);

    for (const key in newErrors) {
      if (newErrors[key as keyof typeof newErrors]) {
        valid = false;
      }
    }

    if (valid) {
      try {
        // Upload the image to Firebase Storage and get the URL
        let profilePictureURL = '';
        if (profile.profilePicture) {
          const storageRef = ref(storage, `profilePictures/${profile.profilePicture.name}`);
          await uploadBytes(storageRef, profile.profilePicture);
          profilePictureURL = await getDownloadURL(storageRef);
        }

        // Save the profile data to Firestore
        await setDoc(doc(firestore, 'profiles', profile.email), {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          profilePictureURL,
        });

        setSuccessMessage('Your changes have been successfully saved!');
      } catch (error) {
        console.error("Error saving profile: ", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          profilePicture: 'Error saving profile. Please try again.',
        }));
      }
    } else {
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Profile Details</h2>
      <p className="mb-6 text-gray-600">Add your details to create a personal touch to your profile.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <label className="block text-sm font-medium text-gray-700">Profile picture</label>
          <div className="col-span-1 md:col-span-1 flex items-center justify-center">
            <label
              htmlFor="profilePicture"
              className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-blue-50 rounded-lg border border-dashed border-gray-300 text-blue-500 hover:bg-blue-100"
            >
              <Icon icon="carbon:image" className="w-10 h-10 mb-1" />
              <span className="text-xs">+ Upload Image</span>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">Image must be below 1024x1024px. Use PNG or JPG format.</p>
        </div>
        {errors.profilePicture && (
          <p className="text-red-500 text-center col-span-3">{errors.profilePicture}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="e.g. John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="e.g. Appleseed"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="e.g. email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
        {successMessage && (
          <p className="text-green-500 text-center col-span-3">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default ProfileDetails;
