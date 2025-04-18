'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/core/layout/Header';

export default function AddFavouritePage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+92');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '+92' || (value.startsWith('+92') && value.slice(3).match(/^\d*$/))) {
      setPhoneNumber(value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      // Rensa tidigare preview om det finns
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Skapa ny preview
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
      
      // Återställ input-fältet för att tillåta samma fil igen
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    // Återställ error state om numret är tomt eller bara +92
    if (phoneNumber === '+92' || phoneNumber === '') {
      setIsPhoneError(null);
      setIsValid(false);
      return;
    }

    const timer = setTimeout(() => {
      const isNameValid = fullName.trim().length > 0;
      const isPhoneValid = phoneNumber.startsWith('+92') && phoneNumber.slice(3).length >= 8;
      
      setIsPhoneError(phoneNumber.length > 3 && !isPhoneValid);
      setIsValid(isNameValid && isPhoneValid);
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneNumber, fullName]);

  const truncateFileName = (fileName: string) => {
    if (fileName.length <= 10) return fileName;
    const extension = fileName.split('.').pop();
    return `${fileName.slice(0, 7)}...${extension}`;
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      setErrorMessage(null);
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phoneNumber', phoneNumber);
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const response = await fetch('/api/favourites', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && data.error === 'Contact already exists') {
          setErrorMessage('A contact with this phone number already exists');
        } else {
          setErrorMessage(data.error || 'Failed to save favourite');
        }
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving favourite:', error);
      setErrorMessage('Failed to save favourite. Please try again.');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FEFEFE] overflow-hidden rounded-[24px] p-6">
      {/* Header från dashboard */}
      <Header showMenu={false} showNotifications={true} />
      <main className="mt-8">
        <h1 className="text-[24px] text-[#171717] mb-0">Add favourite</h1>
        
        {/* Input Fields */}
        <div className="bg-white rounded-2xl p-4 mb-4 mt-4 border border-[#D9D9D9]">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="text-sm text-gray-500">Enter your favourites full name</label>
            <input
              type="text"
              value={fullName}
              onChange={handleNameChange}
              placeholder="Name and Surname"
              className="h-[48px] border rounded-[99px] px-4 mt-2 w-full box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
              style={{
                borderColor: '#E7ECF0'
              }}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Enter phone number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="h-[48px] border rounded-[99px] px-4 mt-2 w-full box-border font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
              style={{
                borderColor: '#E7ECF0'
              }}
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl p-4 border border-[#D9D9D9]">
          {!previewUrl ? (
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="w-6 h-6">
                <Image
                  src="/img/favourite.svg"
                  alt="Add favourite"
                  width={24}
                  height={24}
                />
              </div>
              <span>Add a photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-gray-500 flex-1 truncate">
                {selectedFile ? truncateFileName(selectedFile.name) : ''}
              </span>
              <button
                onClick={handleRemovePhoto}
                className="w-16 h-8 bg-[#FF6B6B] text-white rounded-[99px] text-xs hover:bg-[#FF6B6B] transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full h-[56px] rounded-2xl transition-all font-semibold mt-4 ${
            isValid 
              ? 'bg-[#7C1E1C] text-white cursor-pointer hover:bg-[#6A1A18]'
              : isPhoneError
                ? 'bg-[#FF6B6B] text-white cursor-not-allowed'
                : 'bg-[#E4E4E4] text-[rgba(27,27,27,0.5)] cursor-not-allowed'
          }`}
        >
          {isPhoneError ? 'Phone number must start with +92 and have at least 8 digits' : 'Save favourite'}
        </button>
      </div>
    </div>
  );
}
