
import React, { useEffect } from 'react'
import Image from 'next/image';
import { AVATAR_PATH, AVATAR_URL } from '@/constants/avatar';
import { FaCrosshairs } from "react-icons/fa6";

interface AvatarImageProps {
    currentAvatar: string;
    onSelect: (avatar: string) => void;
    onClose: () => void;
}
const AvatarImage = ({ currentAvatar, onSelect, onClose }:AvatarImageProps) => {
    const modelRef = React.useRef<HTMLImageElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      <div 
        ref={modelRef}
        className="dark-gradient rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary-200">Choose an Avatar for yourself</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaCrosshairs />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {AVATAR_URL.map((avatar, index) => {
            const fullAvatarPath = `${AVATAR_PATH}${avatar}`;
            
            return (
              <div 
                key={index}
                className={`relative cursor-pointer rounded-full p-1 transition-all ${
                  currentAvatar === fullAvatarPath ? 'border-2 border-blue-500 bg-yellow-200' : 'border border-gray-500 hover:border-blue-500'
                }`}
                onClick={() => onSelect(fullAvatarPath)}
              >
                <Image 
                  src={fullAvatarPath}
                  alt={`Avatar option ${index + 1}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover aspect-square"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default AvatarImage