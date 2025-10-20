import React from 'react';
export const FoodIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.622a8.88 8.88 0 003-3.812A8.32 8.32 0 0115.362 5.214z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75v-3.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75z" />
    </svg>
);