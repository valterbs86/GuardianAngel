"use client";

import React from 'react';

interface GuardianAngelLogoProps {
  className?: string;
}

const GuardianAngelLogo: React.FC<GuardianAngelLogoProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00FFFF" // Neon blue
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 7l10 5 10-5" />
      <path d="M2 7v10c0 1 4 2 10 2s10-1 10-2V7" />
      <path d="M7 21v-4" />
      <path d="M17 21v-4" />
    </svg>
  );
};

export default GuardianAngelLogo;
