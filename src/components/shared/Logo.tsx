import React, { useState, useRef } from 'react';
import { logoSrc as defaultLogoSrc } from '@/assets/logo.ts';

interface LogoProps {
  collapsed: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  const [logoSrc, setLogoSrc] = useState(defaultLogoSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center">
      <div onClick={handlePlaceholderClick} style={{ cursor: 'pointer' }}>
        <img src={logoSrc} alt="TravelPlans.fun" className={`transition-all duration-300 ${collapsed ? 'h-10 w-10' : 'h-16'}`} />
      </div>
      {!collapsed && (
        <span className="ml-3 text-2xl font-bold text-white">Travelplans.fun</span>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLogoUpload}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  );
};