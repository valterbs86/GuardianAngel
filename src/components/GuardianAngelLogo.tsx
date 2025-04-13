"use client";

import React from 'react';

interface GuardianAngelLogoProps {
  className?: string;
}

const GuardianAngelLogo: React.FC<GuardianAngelLogoProps> = ({ className }) => {
  return (
    <img
      src="/ga_logo.JPG" // Path to your logo image
      alt="Guardian Angel Logo"
      className={className}
      style={{ width: '100px', height: 'auto' }} // Adjust size as needed
    />
  );
};

export default GuardianAngelLogo;
