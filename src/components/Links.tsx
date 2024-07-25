import { useState } from 'react';
import { Icon } from '@iconify/react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig'; // Ensure correct import path

const platforms = [
  { name: 'GitHub', icon: 'mdi:github', pattern: /https:\/\/(www\.)?github\.com\/.+/ },
  { name: 'Facebook', icon: 'mdi:facebook', pattern: /https:\/\/(www\.)?facebook\.com\/.+/ },
  { name: 'Twitter', icon: 'mdi:twitter', pattern: /https:\/\/(www\.)?twitter\.com\/.+/ },
  { name: 'Codewars', icon: 'mdi:codepen', pattern: /https:\/\/(www\.)?codewars\.com\/.+/ },
  { name: 'StackOverflow', icon: 'mdi:stack-overflow', pattern: /https:\/\/(www\.)?stackoverflow\.com\/.+/ },
  { name: 'Instagram', icon: 'mdi:instagram', pattern: /https:\/\/(www\.)?instagram\.com\/.+/ },
  { name: 'YouTube', icon: 'mdi:youtube', pattern: /https:\/\/(www\.)?youtube\.com\/.+/ },
  { name: 'GitLab', icon: 'mdi:gitlab', pattern: /https:\/\/(www\.)?gitlab\.com\/.+/ },
  { name: 'Dev', icon: 'mdi:dev-to', pattern: /https:\/\/(www\.)?dev\.to\/.+/ },
];

interface Link {
  platform: string;
  url: string;
  error: string;
}

const Links: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const addLink = () => {
    setLinks([...links, { platform: '', url: '', error: '' }]);
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const newLinks = [...links];
    newLinks[index].platform = platform;
    newLinks[index].error = ''; // Reset error message on change
    setLinks(newLinks);
  };

  const handleUrlChange = (index: number, url: string) => {
    const newLinks = [...links];
    newLinks[index].url = url;
    newLinks[index].error = ''; // Reset error message on change
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const validateLinks = () => {
    const newLinks = links.map((link) => {
      if (!link.platform) {
        return { ...link, error: "Can't be blank" };
      }
      const platform = platforms.find((p) => p.name === link.platform);
      if (!link.url.match(platform?.pattern || /.*/)) {
        return { ...link, error: 'Please check URL' };
      }
      return link;
    });
    setLinks(newLinks);
    return newLinks.every((link) => link.error === '');
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (validateLinks()) {
      try {
        const linksData = links.map(link => ({ platform: link.platform, url: link.url }));
        await addDoc(collection(firestore, 'links'), { links: linksData });
        alert('Links saved successfully!');
        setLinks([]); // Clear links after save
        setShowErrors(false);
      } catch (error) {
        console.error('Error saving links: ', error);
        alert('Error saving links. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-md w-full md:w-2/3">
      <h1 className="text-2xl font-bold text-center">Customize your links</h1>
      <p className="text-center text-gray-500 mt-2">
        Add/edit/remove links below and then share all your profiles with the world!
      </p>

      <button 
        className="flex items-center justify-center w-full mt-4 p-2 border-2 border-dashed border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        onClick={addLink}
      >
        <Icon icon="material-symbols:add" className="mr-2" />
        + Add new link
      </button>

      {links.length === 0 && (
        <div className="mt-8 p-6 bg-gray-100 rounded-md w-full text-center">
          <Icon icon="mdi:cellphone-link" className="mx-auto mb-4 text-purple-500" width="40" height="40" />
          <h2 className="text-xl font-bold">Let &apos;s get you started</h2>
          <p className="text-gray-500 mt-2">
            Use the &quot;Add new link&quot; button to get started. Once you have more than one link, you can reorder and edit them.
            We &apos;re here to help you share your profiles with everyone!
          </p>
        </div>
      )}

      {links.map((link, index) => (
        <div key={index} className="mt-4 w-full border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Icon icon="mdi:drag-vertical" className="mr-2 text-gray-400 cursor-pointer" />
              <span className="font-bold">Link #{index + 1}</span>
            </div>
            <button onClick={() => removeLink(index)} className="text-red-500 hover:underline">Remove</button>
          </div>
          <div className="mt-4 relative">
            <label className="block text-sm font-medium text-gray-700">Platform</label>
            <div className="relative">
              <select
                className={`mt-1 block w-full pl-10 pr-10 py-2 text-base border ${link.error && !link.platform ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                value={link.platform}
                onChange={(e) => handlePlatformChange(index, e.target.value)}
              >
                <option value="">Select a platform</option>
                {platforms.map((platform) => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {link.platform && (
                  <Icon icon={platforms.find((p) => p.name === link.platform)?.icon} className="text-gray-500" />
                )}
              </div>
            </div>
            {showErrors && link.error && !link.platform && (
              <div className="absolute top-2 right-2">
                <span className="text-red-500 text-sm">{link.error}</span>
              </div>
            )}
          </div>
          <div className="mt-4 relative">
            <label className="block text-sm font-medium text-gray-700">Link</label>
            <input
              type="text"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${link.error && link.platform ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
              value={link.url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder={`e.g. https://www.${link.platform.toLowerCase()}.com/username`}
            />
            {showErrors && link.error && link.platform && (
              <div className="absolute top-2 right-2">
                <span className="text-red-500 text-sm">{link.error}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <button 
        onClick={handleSave}
        className="mt-8 px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700"
      >
        Save
      </button>
    </div>
  );
};

export default Links;
