"use client";

import React from 'react';

interface GuardianAngelLogoProps {
  className?: string;
}

const GuardianAngelLogo: React.FC<GuardianAngelLogoProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      stroke="#00FFFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M65.54,24.77c-4.61-3.41-10.79-5.27-17.15-5.27S37.22,21.36,32.61,24.77C19.5,34.4,11.57,49.82,11.57,66.64c0,13.77,8.7,26.4,22.19,31.46a3.33,3.33,0,0,0,4.16.19c1.76-1.49,3.55-3.07,5.25-4.55,3.19-2.76,6.25-5.41,8.91-7.73,1.48-1.2,2.87-2.34,4.11-3.41,1.71-1.5,3.44-2.93,5.1-4.26,3.11-2.47,6.12-4.84,8.84-6.94,1.45-1.08,2.81-2.1,4.03-3,1.7-1.25,3.33-2.43,4.9-3.51,2.92-2,5.73-3.89,8.27-5.49,1.38-0.85,2.68-1.65,3.83-2.36a1.77,1.77,0,0,0,.78-2.49v-0.12C88.43,49.82,80.5,34.4,65.54,24.77Z" />
      <path d="M63.58,43.67c-0.35,0.3-0.69,0.61-1,0.93-4.28,3.8-10.13,6.24-16.39,6.24s-12.11-2.44-16.39-6.24c-0.31-0.28-0.63-0.58-0.94-0.87" />
      <path d="M50,56.26c6.26,0,12.11,2.44,16.39,6.24,0.31.28,0.63,0.58,0.94.87" />
      <path d="M81.93,66.64c0-16.82-7.93-32.24-21.05-41.87" />
      <path d="M18.07,66.64c0-16.82,7.93-32.24,21.05-41.87" />
      <path d="M38.12,78.47c-1.9,1.62-4.15,3.53-6.68,5.66" />
      <path d="M61.88,78.47c1.9,1.62,4.15,3.53,6.68,5.66" />
      <path d="M43.75,89.41c-1.35,1.16-2.89,2.43-4.55,3.76" />
      <path d="M56.25,89.41c1.35,1.16,2.89,2.43,4.55,3.76" />
    <text x="50%" y="115%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#00FFFF">
        Guardian
    </text>
    <text x="50%" y="125%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#00FFFF">
        Angel
    </text>
    </svg>
  );
};

export default GuardianAngelLogo;
