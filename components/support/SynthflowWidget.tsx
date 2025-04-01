'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SynthflowWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleWidget = () => {
    setIsExpanded(!isExpanded);
    // Förhindra scrollning av bakgrunden när widgeten är öppen
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (isExpanded) {
      // Skapa och lägg till iframe när widgeten är expanderad
      const iframe = document.createElement('iframe');
      iframe.id = 'audio_iframe';
      iframe.src = 'https://widget.synthflow.ai/widget/v2/1741429089828x197792133297185700/1741429089595x676053001710555800';
      iframe.allow = 'microphone';
      iframe.width = '400px';
      iframe.height = '520px';
      iframe.style.position = 'fixed';
      iframe.style.left = '50%';
      iframe.style.top = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.background = 'transparent';
      iframe.style.border = 'none';
      iframe.style.zIndex = '1000';
      iframe.scrolling = 'no';

      document.body.appendChild(iframe);

      return () => {
        // Ta bort iframe och återställ scrollning när widgeten minimeras
        const existingIframe = document.getElementById('audio_iframe');
        if (existingIframe) {
          existingIframe.remove();
        }
        document.body.style.overflow = 'auto';
      };
    }
  }, [isExpanded]);

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          onClick={toggleWidget}
        />
      )}

      {/* Widget Controls */}
      <div className="fixed right-6 bottom-6 z-[1000]">
        {!isExpanded && (
          <button
            onClick={toggleWidget}
            className="bg-[#F4D5B5] hover:bg-[#E4C5A5] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" 
                fill="#1B1B1B"
              />
              <path 
                d="M12 12H6V14H12V12ZM18 8H6V10H18V8ZM18 4H6V6H18V4Z" 
                fill="#1B1B1B"
              />
            </svg>
          </button>
        )}
        {isExpanded && (
          <button
            onClick={toggleWidget}
            className="fixed top-4 right-4 z-[1001] bg-[#F4D5B5] hover:bg-[#E4C5A5] w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" 
                fill="#1B1B1B"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default SynthflowWidget;
